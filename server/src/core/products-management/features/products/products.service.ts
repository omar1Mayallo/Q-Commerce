import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from 'src/database/database.provider';
import { CreateProductDTO, UpdateProductDTO } from './products.dto';
import { TABLES } from 'src/shared/constants/tables.constants';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(KNEX_CONNECTION)
    private readonly knex: Knex,
  ) {}

  async createProduct(data: CreateProductDTO) {
    return await this.knex.transaction(async (trx) => {
      // Step 1: Insert Product
      const [product] = await trx(TABLES.PRODUCTS)
        .insert({
          category_id: data.category_id,
          product_name: data.product_name,
          product_description: data.product_description,
          base_price: data.base_price,
          base_quantity: data.base_quantity,
          base_tax_rate: data.base_tax_rate,
          base_tax_amount: data.base_tax_amount,
        })
        .returning('*');

      // Step 2: Insert Variants and collect their IDs with SKUs
      const variantIds = await Promise.all(
        data.variants.map(async (variant) => {
          const [productVariant] = await trx(TABLES.PRODUCT_VARIANTS)
            .insert({
              product_id: product.id,
              sku: variant.sku,
              unique_variant_name: variant.unique_variant_name,
            })
            .returning('*');

          // Insert variant attributes
          await trx(TABLES.PRODUCT_VARIANT_ATTRIBUTES).insert(
            variant.variant_attributes.map((attr) => ({
              product_variant_id: productVariant.id,
              attribute_id: attr.attribute_id,
              attribute_option_id: attr.attribute_option_id,
            })),
          );

          return { id: productVariant.id, sku: variant.sku };
        }),
      );

      // Step 3: Map Regional Data with product_variant_id based on SKU
      const regionalDataToInsert = data.regionalData.map((region) => {
        // Find the variant ID that matches the SKU in regional data
        const matchedVariant = variantIds.find((v) => v.sku === region.sku);
        if (!matchedVariant) {
          throw new NotFoundException(
            `Variant with SKU ${region.sku} does not exist`,
          );
        }

        return {
          product_variant_id: matchedVariant.id,
          country_code: region.country_code,
          currency_code: region.currency_code,
          price: region.price,
          tax_rate: region.tax_rate,
          tax_amount: region.tax_amount,
          quantity: region.quantity,
        };
      });

      // Step 4: Insert Regional Data
      await trx(TABLES.PRODUCT_REGIONAL_DATA).insert(regionalDataToInsert);

      // Step 5: Insert Product Images
      if (data.images && data.images.length > 0) {
        const imagesData = data.images.map((image) => ({
          product_id: product.id,
          img_url: image.img_url,
          img_type: image.img_type,
          img_order: image.img_order,
        }));
        await trx(TABLES.PRODUCT_IMAGES).insert(imagesData);
      }

      // Return the created product and variants as confirmation
      return { product, variants: variantIds };
    });
  }

  async getProductDetails(
    id: number,
    countryCode: string,
    currencyCode: string,
    variantOptions: string,
  ) {
    const options = variantOptions.split(',').map(Number); // Convert comma-separated options to an array of numbers

    // Find matching product variant based on exact match of attribute options
    const variantQuery = await this.knex(TABLES.PRODUCT_VARIANTS)
      .select('id')
      .where('product_id', id)
      .whereExists(function () {
        this.select(1)
          .from(TABLES.PRODUCT_VARIANT_ATTRIBUTES)
          .whereRaw('"product_variant_id" = ??', [
            `${TABLES.PRODUCT_VARIANTS}.id`,
          ])
          .whereIn('attribute_option_id', options)
          .groupBy('product_variant_id')
          .having(
            this.client.raw('COUNT(DISTINCT attribute_option_id) = ?', [
              options.length,
            ]),
          );
      })
      .first();

    if (!variantQuery) {
      throw new NotFoundException(
        'No matching product variant found for the specified options.',
      );
    }

    // Fetch product and its category
    const product = await this.knex(TABLES.PRODUCTS)
      .select(
        `${TABLES.PRODUCTS}.product_name`,
        `${TABLES.PRODUCTS}.product_description`,
        `${TABLES.PRODUCTS}.base_price`,
        `${TABLES.CATEGORIES}.category_name`,
        `${TABLES.CATEGORIES}.category_description`,
      )
      .leftJoin(
        TABLES.CATEGORIES,
        `${TABLES.PRODUCTS}.category_id`,
        `${TABLES.CATEGORIES}.id`,
      )
      .where(`${TABLES.PRODUCTS}.id`, id)
      .first();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Get regional data for the selected country and currency
    const regionalData = await this.knex(TABLES.PRODUCT_REGIONAL_DATA)
      .where({
        product_variant_id: variantQuery.id,
        country_code: countryCode,
        currency_code: currencyCode,
      })
      .first();

    if (!regionalData) {
      throw new NotFoundException(
        'No regional data available for this product in the specified country and currency.',
      );
    }

    // Get product images
    const images = await this.knex(TABLES.PRODUCT_IMAGES).where(
      'product_id',
      id,
    );

    // Get detailed attribute and option information for the selected variant
    const variantAttributes = await this.knex(TABLES.PRODUCT_VARIANT_ATTRIBUTES)
      .select(
        `${TABLES.ATTRIBUTES}.id as attribute_id`,
        `${TABLES.ATTRIBUTES}.attribute_name`,
        `${TABLES.ATTRIBUTE_OPTIONS}.id as option_id`,
        `${TABLES.ATTRIBUTE_OPTIONS}.option_name`,
      )
      .join(
        TABLES.ATTRIBUTES,
        `${TABLES.PRODUCT_VARIANT_ATTRIBUTES}.attribute_id`,
        `${TABLES.ATTRIBUTES}.id`,
      )
      .join(
        TABLES.ATTRIBUTE_OPTIONS,
        `${TABLES.PRODUCT_VARIANT_ATTRIBUTES}.attribute_option_id`,
        `${TABLES.ATTRIBUTE_OPTIONS}.id`,
      )
      .where('product_variant_id', variantQuery.id);

    const variants = variantAttributes.map((attr) => ({
      attribute_id: attr.attribute_id,
      attribute_name: attr.attribute_name,
      option_id: attr.option_id,
      option_name: attr.option_name,
    }));

    return {
      product_name: product.product_name,
      product_description: product.product_description,
      base_price: product.base_price,
      category: {
        category_name: product.category_name,
        category_description: product.category_description,
      },
      images,
      variants,
      regional_data: {
        country_code: countryCode,
        currency_code: currencyCode,
        price: regionalData.price,
        tax_rate: regionalData.tax_rate,
        tax_amount: regionalData.tax_amount,
        quantity: regionalData.quantity,
      },
    };
  }

  async getAvailableVariants(productId: number, selectedOptions: number[]) {
    // Find all variant IDs that match the selected options
    const matchedVariantIds = await this.knex(TABLES.PRODUCT_VARIANTS)
      .select('id')
      .where('product_id', productId)
      .whereExists(function () {
        this.select('*')
          .from(TABLES.PRODUCT_VARIANT_ATTRIBUTES)
          .whereRaw('?? = ??', [
            'product_variant_id',
            `${TABLES.PRODUCT_VARIANTS}.id`,
          ])
          .whereIn('attribute_option_id', selectedOptions);
      });

    if (!matchedVariantIds.length) {
      throw new NotFoundException(
        'No available variants found for the selected options.',
      );
    }

    // Find and populate available attribute options
    const remainingOptions = await this.knex(TABLES.PRODUCT_VARIANT_ATTRIBUTES)
      .select(
        'Attributes.id as attribute_id',
        'Attributes.attribute_name',
        'AttributeOptions.id as attribute_option_id',
        'AttributeOptions.option_name',
      )
      .innerJoin(
        TABLES.ATTRIBUTES,
        'Attributes.id',
        'ProductVariantAttributes.attribute_id',
      )
      .innerJoin(
        TABLES.ATTRIBUTE_OPTIONS,
        'AttributeOptions.id',
        'ProductVariantAttributes.attribute_option_id',
      )
      .whereIn(
        'product_variant_id',
        matchedVariantIds.map((v) => v.id),
      )
      .whereNotIn('attribute_option_id', selectedOptions);

    return {
      availableVariants: remainingOptions,
    };
  }

  async updateProduct(id: number, data: UpdateProductDTO) {
    return await this.knex.transaction(async (trx) => {
      // Check if product exists
      const productExists = await trx(TABLES.PRODUCTS).where('id', id).first();
      if (!productExists) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }

      // Update product core details
      if (
        data.category_id ||
        data.product_name ||
        data.product_description ||
        data.base_price ||
        data.base_quantity ||
        data.base_tax_rate ||
        data.base_tax_amount
      ) {
        await trx(TABLES.PRODUCTS).where('id', id).update({
          category_id: data.category_id,
          product_name: data.product_name,
          product_description: data.product_description,
          base_price: data.base_price,
          base_quantity: data.base_quantity,
          base_tax_rate: data.base_tax_rate,
          base_tax_amount: data.base_tax_amount,
        });
      }

      // Update or add product variants
      if (data.variants) {
        // Delete existing variants if specified
        await trx(TABLES.PRODUCT_VARIANTS).where('product_id', id).del();

        // Insert new variants
        for (const variant of data.variants) {
          const [variantId] = await trx(TABLES.PRODUCT_VARIANTS)
            .insert({
              product_id: id,
              sku: variant.sku,
              unique_variant_name: variant.unique_variant_name,
            })
            .returning('id');

          // Insert variant attributes
          if (variant.variant_attributes) {
            const variantAttributes = variant.variant_attributes.map(
              (attr) => ({
                product_variant_id: variantId,
                attribute_id: attr.attribute_id,
                attribute_option_id: attr.attribute_option_id,
              }),
            );
            await trx(TABLES.PRODUCT_VARIANT_ATTRIBUTES).insert(
              variantAttributes,
            );
          }
        }
      }

      // Update regional data
      if (data.regionalData) {
        await trx(TABLES.PRODUCT_REGIONAL_DATA).where('product_id', id).del();
        const regionalData = data.regionalData.map((region) => ({
          product_id: id,
          country_code: region.country_code,
          currency_code: region.currency_code,
          price: region.price,
          tax_rate: region.tax_rate,
          tax_amount: region.tax_amount,
          quantity: region.quantity,
        }));
        await trx(TABLES.PRODUCT_REGIONAL_DATA).insert(regionalData);
      }

      // Update product images
      if (data.images) {
        await trx(TABLES.PRODUCT_IMAGES).where('product_id', id).del();
        const imagesData = data.images.map((image) => ({
          product_id: id,
          img_url: image.img_url,
          img_type: image.img_type,
          img_order: image.img_order,
        }));
        await trx(TABLES.PRODUCT_IMAGES).insert(imagesData);
      }

      return { message: 'Product updated successfully' };
    });
  }
}
