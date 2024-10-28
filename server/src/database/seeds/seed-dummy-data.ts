import { Knex } from 'knex';
import { TABLES } from '../../shared/constants/tables.constants';
import { UserRolesE } from '../../core/users-management/common/constants';

export async function seed(knex: Knex): Promise<void> {
  // Clear existing data
  await knex(TABLES.PRODUCT_REGIONAL_DATA).del();
  await knex(TABLES.PRODUCT_IMAGES).del();
  await knex(TABLES.PRODUCT_VARIANT_ATTRIBUTES).del();
  await knex(TABLES.PRODUCT_VARIANTS).del();
  await knex(TABLES.ATTRIBUTE_OPTIONS).del();
  await knex(TABLES.ATTRIBUTES).del();
  await knex(TABLES.PRODUCTS).del();
  await knex(TABLES.CATEGORIES).del();
  await knex(TABLES.CURRENCIES).del();
  await knex(TABLES.COUNTRIES).del();
  await knex(TABLES.ADDRESSES).del();
  await knex(TABLES.PHONE_NUMBERS).del();
  await knex(TABLES.USERS).del();

  // Seed Countries
  await knex(TABLES.COUNTRIES).insert([
    { country_code: 'US', country_name: 'United States' },
    { country_code: 'CA', country_name: 'Canada' },
    { country_code: 'GB', country_name: 'United Kingdom' },
  ]);

  // Seed Currencies
  await knex(TABLES.CURRENCIES).insert([
    { currency_code: 'USD', currency_name: 'US Dollar', exchange_rate: 1.0 },
    {
      currency_code: 'CAD',
      currency_name: 'Canadian Dollar',
      exchange_rate: 1.25,
    },
    {
      currency_code: 'GBP',
      currency_name: 'British Pound',
      exchange_rate: 0.75,
    },
  ]);

  // Seed Categories and get only IDs
  const categoryIds = await knex(TABLES.CATEGORIES)
    .insert([
      {
        category_name: 'Accessories',
        category_description: 'Various accessories',
      },
      {
        category_name: 'Electronics',
        category_description: 'Electronic items',
      },
      {
        category_name: 'Clothes',
        category_description: 'Apparel and clothing',
      },
    ])
    .returning('id');

  // Extract ids from the returned objects
  const [accessoriesId, electronicsId, clothesId] = categoryIds.map(
    (obj) => obj.id,
  );

  // Insert subcategories with integer IDs
  await knex(TABLES.CATEGORIES).insert([
    {
      parent_category_id: accessoriesId,
      category_name: 'Watches',
      category_description: 'Wrist watches',
    },
    {
      parent_category_id: electronicsId,
      category_name: 'Mobile Phones',
      category_description: 'Smartphones',
    },
    {
      parent_category_id: clothesId,
      category_name: 'T-Shirts',
      category_description: 'Casual T-Shirts',
    },
  ]);

  // Seed Users
  const passwordHash =
    '$2b$12$RJyJrmd4HMc8foxRNs2sI.D2cxv3d2v1CSS9npxprjl687933I6Zq';
  await knex(TABLES.USERS).insert([
    {
      username: 'admin',
      email: 'admin@example.com',
      password: passwordHash,
      role: UserRolesE.ADMIN,
    },
    {
      username: 'user',
      email: 'user@example.com',
      password: passwordHash,
      role: UserRolesE.USER,
    },
  ]);

  // Seed Attributes and get only IDs
  const attributeIds = await knex(TABLES.ATTRIBUTES)
    .insert([
      { attribute_name: 'Size' },
      { attribute_name: 'Color' },
      { attribute_name: 'Material' },
    ])
    .returning('id');

  // Extract ids from the returned objects
  const [sizeAttrId, colorAttrId, materialAttrId] = attributeIds.map(
    (obj) => obj.id,
  );

  // Seed Attribute Options
  await knex(TABLES.ATTRIBUTE_OPTIONS).insert([
    { attribute_id: sizeAttrId, option_name: 'Small' },
    { attribute_id: sizeAttrId, option_name: 'Medium' },
    { attribute_id: sizeAttrId, option_name: 'Large' },
    { attribute_id: colorAttrId, option_name: 'Red' },
    { attribute_id: colorAttrId, option_name: 'Blue' },
    { attribute_id: colorAttrId, option_name: 'Green' },
    { attribute_id: materialAttrId, option_name: 'Cotton' },
    { attribute_id: materialAttrId, option_name: 'Polyester' },
    { attribute_id: materialAttrId, option_name: 'Wool' },
  ]);

  // Seed Products with multiple variants and options
  const productIds = await knex(TABLES.PRODUCTS)
    .insert([
      {
        product_name: 'Basic T-Shirt',
        product_description: 'A comfortable, everyday T-shirt',
        base_price: 19.99,
        base_quantity: 100,
        base_tax_rate: 8,
        category_id: 3, // Assuming "Clothes" category has id 3
      },
      {
        product_name: 'Hoodie',
        product_description: 'Cozy hoodie with adjustable drawstring',
        base_price: 49.99,
        base_quantity: 60,
        base_tax_rate: 8,
        category_id: 3,
      },
    ])
    .returning('id');

  const [tshirtId, hoodieId] = productIds.map((obj) => obj.id);

  // Seed Product Variants for T-Shirts with Size and Color Options
  const tshirtVariants = await knex(TABLES.PRODUCT_VARIANTS)
    .insert([
      {
        product_id: tshirtId,
        sku: 'TSHIRT-SM-BLUE',
        unique_variant_name: 'Basic T-Shirt - Small - Blue',
      },
      {
        product_id: tshirtId,
        sku: 'TSHIRT-MD-BLUE',
        unique_variant_name: 'Basic T-Shirt - Medium - Blue',
      },
      {
        product_id: tshirtId,
        sku: 'TSHIRT-LG-BLUE',
        unique_variant_name: 'Basic T-Shirt - Large - Blue',
      },
      {
        product_id: tshirtId,
        sku: 'TSHIRT-SM-RED',
        unique_variant_name: 'Basic T-Shirt - Small - Red',
      },
      {
        product_id: tshirtId,
        sku: 'TSHIRT-MD-RED',
        unique_variant_name: 'Basic T-Shirt - Medium - Red',
      },
      {
        product_id: tshirtId,
        sku: 'TSHIRT-LG-RED',
        unique_variant_name: 'Basic T-Shirt - Large - Red',
      },
    ])
    .returning('id');

  const [
    tshirtSmallBlue,
    tshirtMediumBlue,
    tshirtLargeBlue,
    tshirtSmallRed,
    tshirtMediumRed,
    tshirtLargeRed,
  ] = tshirtVariants.map((obj) => obj.id);

  // Seed Product Variant Attributes for T-Shirts
  await knex(TABLES.PRODUCT_VARIANT_ATTRIBUTES).insert([
    {
      product_variant_id: tshirtSmallBlue,
      attribute_id: 1,
      attribute_option_id: 1,
    }, // Size: Small
    {
      product_variant_id: tshirtSmallBlue,
      attribute_id: 2,
      attribute_option_id: 4,
    }, // Color: Blue
    {
      product_variant_id: tshirtMediumBlue,
      attribute_id: 1,
      attribute_option_id: 2,
    }, // Size: Medium
    {
      product_variant_id: tshirtMediumBlue,
      attribute_id: 2,
      attribute_option_id: 4,
    }, // Color: Blue
    {
      product_variant_id: tshirtLargeBlue,
      attribute_id: 1,
      attribute_option_id: 3,
    }, // Size: Large
    {
      product_variant_id: tshirtLargeBlue,
      attribute_id: 2,
      attribute_option_id: 4,
    }, // Color: Blue
    {
      product_variant_id: tshirtSmallRed,
      attribute_id: 1,
      attribute_option_id: 1,
    }, // Size: Small
    {
      product_variant_id: tshirtSmallRed,
      attribute_id: 2,
      attribute_option_id: 5,
    }, // Color: Red
    {
      product_variant_id: tshirtMediumRed,
      attribute_id: 1,
      attribute_option_id: 2,
    }, // Size: Medium
    {
      product_variant_id: tshirtMediumRed,
      attribute_id: 2,
      attribute_option_id: 5,
    }, // Color: Red
    {
      product_variant_id: tshirtLargeRed,
      attribute_id: 1,
      attribute_option_id: 3,
    }, // Size: Large
    {
      product_variant_id: tshirtLargeRed,
      attribute_id: 2,
      attribute_option_id: 5,
    }, // Color: Red
  ]);

  // Seed Product Variants for Hoodies with Size and Color Options
  const hoodieVariants = await knex(TABLES.PRODUCT_VARIANTS)
    .insert([
      {
        product_id: hoodieId,
        sku: 'HOODIE-SM-GREY',
        unique_variant_name: 'Hoodie - Small - Grey',
      },
      {
        product_id: hoodieId,
        sku: 'HOODIE-MD-GREY',
        unique_variant_name: 'Hoodie - Medium - Grey',
      },
      {
        product_id: hoodieId,
        sku: 'HOODIE-LG-GREY',
        unique_variant_name: 'Hoodie - Large - Grey',
      },
      {
        product_id: hoodieId,
        sku: 'HOODIE-SM-BLACK',
        unique_variant_name: 'Hoodie - Small - Black',
      },
      {
        product_id: hoodieId,
        sku: 'HOODIE-MD-BLACK',
        unique_variant_name: 'Hoodie - Medium - Black',
      },
      {
        product_id: hoodieId,
        sku: 'HOODIE-LG-BLACK',
        unique_variant_name: 'Hoodie - Large - Black',
      },
    ])
    .returning('id');

  const [
    hoodieSmallGrey,
    hoodieMediumGrey,
    hoodieLargeGrey,
    hoodieSmallBlack,
    hoodieMediumBlack,
    hoodieLargeBlack,
  ] = hoodieVariants.map((obj) => obj.id);

  // Seed Product Variant Attributes for Hoodies
  await knex(TABLES.PRODUCT_VARIANT_ATTRIBUTES).insert([
    {
      product_variant_id: hoodieSmallGrey,
      attribute_id: 1,
      attribute_option_id: 1,
    }, // Size: Small
    {
      product_variant_id: hoodieSmallGrey,
      attribute_id: 2,
      attribute_option_id: 6,
    }, // Color: Grey
    {
      product_variant_id: hoodieMediumGrey,
      attribute_id: 1,
      attribute_option_id: 2,
    }, // Size: Medium
    {
      product_variant_id: hoodieMediumGrey,
      attribute_id: 2,
      attribute_option_id: 6,
    }, // Color: Grey
    {
      product_variant_id: hoodieLargeGrey,
      attribute_id: 1,
      attribute_option_id: 3,
    }, // Size: Large
    {
      product_variant_id: hoodieLargeGrey,
      attribute_id: 2,
      attribute_option_id: 6,
    }, // Color: Grey
    {
      product_variant_id: hoodieSmallBlack,
      attribute_id: 1,
      attribute_option_id: 1,
    }, // Size: Small
    {
      product_variant_id: hoodieSmallBlack,
      attribute_id: 2,
      attribute_option_id: 5,
    }, // Color: Black
    {
      product_variant_id: hoodieMediumBlack,
      attribute_id: 1,
      attribute_option_id: 2,
    }, // Size: Medium
    {
      product_variant_id: hoodieMediumBlack,
      attribute_id: 2,
      attribute_option_id: 5,
    }, // Color: Black
    {
      product_variant_id: hoodieLargeBlack,
      attribute_id: 1,
      attribute_option_id: 3,
    }, // Size: Large
    {
      product_variant_id: hoodieLargeBlack,
      attribute_id: 2,
      attribute_option_id: 5,
    }, // Color: Black
  ]);

  // Seed Product Images for T-Shirts and Hoodies
  await knex(TABLES.PRODUCT_IMAGES).insert([
    {
      product_id: tshirtId,
      img_url: 'https://example.com/tshirt_blue.jpg',
      img_type: 'front',
      img_order: 1,
    },
    {
      product_id: tshirtId,
      img_url: 'https://example.com/tshirt_red.jpg',
      img_type: 'front',
      img_order: 2,
    },
    {
      product_id: hoodieId,
      img_url: 'https://example.com/hoodie_grey.jpg',
      img_type: 'front',
      img_order: 1,
    },
    {
      product_id: hoodieId,
      img_url: 'https://example.com/hoodie_black.jpg',
      img_type: 'front',
      img_order: 2,
    },
  ]);

  // Seed Product Regional Data for T-Shirts in the US and Canada
  await knex(TABLES.PRODUCT_REGIONAL_DATA).insert([
    // T-Shirt Variants for the US
    {
      product_variant_id: tshirtSmallBlue,
      country_code: 'US',
      currency_code: 'USD',
      price: 19.99,
      tax_rate: 8,
      tax_amount: 1.6,
      quantity: 30,
      discount_price: 18.99,
    },
    {
      product_variant_id: tshirtMediumBlue,
      country_code: 'US',
      currency_code: 'USD',
      price: 19.99,
      tax_rate: 8,
      tax_amount: 1.6,
      quantity: 20,
      discount_price: 18.99,
    },
    {
      product_variant_id: tshirtLargeBlue,
      country_code: 'US',
      currency_code: 'USD',
      price: 19.99,
      tax_rate: 8,
      tax_amount: 1.6,
      quantity: 15,
      discount_price: 18.99,
    },
    {
      product_variant_id: tshirtSmallRed,
      country_code: 'US',
      currency_code: 'USD',
      price: 19.99,
      tax_rate: 8,
      tax_amount: 1.6,
      quantity: 25,
      discount_price: 18.99,
    },
    {
      product_variant_id: tshirtMediumRed,
      country_code: 'US',
      currency_code: 'USD',
      price: 19.99,
      tax_rate: 8,
      tax_amount: 1.6,
      quantity: 10,
      discount_price: 18.99,
    },
    {
      product_variant_id: tshirtLargeRed,
      country_code: 'US',
      currency_code: 'USD',
      price: 19.99,
      tax_rate: 8,
      tax_amount: 1.6,
      quantity: 20,
      discount_price: 18.99,
    },

    // T-Shirt Variants for Canada
    {
      product_variant_id: tshirtSmallBlue,
      country_code: 'CA',
      currency_code: 'CAD',
      price: 24.99,
      tax_rate: 10,
      tax_amount: 2.5,
      quantity: 15,
      discount_price: 22.99,
    },
    {
      product_variant_id: tshirtMediumBlue,
      country_code: 'CA',
      currency_code: 'CAD',
      price: 24.99,
      tax_rate: 10,
      tax_amount: 2.5,
      quantity: 12,
      discount_price: 22.99,
    },
    {
      product_variant_id: tshirtLargeBlue,
      country_code: 'CA',
      currency_code: 'CAD',
      price: 24.99,
      tax_rate: 10,
      tax_amount: 2.5,
      quantity: 10,
      discount_price: 22.99,
    },
    {
      product_variant_id: tshirtSmallRed,
      country_code: 'CA',
      currency_code: 'CAD',
      price: 24.99,
      tax_rate: 10,
      tax_amount: 2.5,
      quantity: 18,
      discount_price: 22.99,
    },
    {
      product_variant_id: tshirtMediumRed,
      country_code: 'CA',
      currency_code: 'CAD',
      price: 24.99,
      tax_rate: 10,
      tax_amount: 2.5,
      quantity: 10,
      discount_price: 22.99,
    },
    {
      product_variant_id: tshirtLargeRed,
      country_code: 'CA',
      currency_code: 'CAD',
      price: 24.99,
      tax_rate: 10,
      tax_amount: 2.5,
      quantity: 12,
      discount_price: 22.99,
    },

    // Hoodie Variants for the US
    {
      product_variant_id: hoodieSmallGrey,
      country_code: 'US',
      currency_code: 'USD',
      price: 49.99,
      tax_rate: 8,
      tax_amount: 4.0,
      quantity: 20,
      discount_price: 47.99,
    },
    {
      product_variant_id: hoodieMediumGrey,
      country_code: 'US',
      currency_code: 'USD',
      price: 49.99,
      tax_rate: 8,
      tax_amount: 4.0,
      quantity: 15,
      discount_price: 47.99,
    },
    {
      product_variant_id: hoodieLargeGrey,
      country_code: 'US',
      currency_code: 'USD',
      price: 49.99,
      tax_rate: 8,
      tax_amount: 4.0,
      quantity: 10,
      discount_price: 47.99,
    },
    {
      product_variant_id: hoodieSmallBlack,
      country_code: 'US',
      currency_code: 'USD',
      price: 49.99,
      tax_rate: 8,
      tax_amount: 4.0,
      quantity: 12,
      discount_price: 47.99,
    },
    {
      product_variant_id: hoodieMediumBlack,
      country_code: 'US',
      currency_code: 'USD',
      price: 49.99,
      tax_rate: 8,
      tax_amount: 4.0,
      quantity: 10,
      discount_price: 47.99,
    },
    {
      product_variant_id: hoodieLargeBlack,
      country_code: 'US',
      currency_code: 'USD',
      price: 49.99,
      tax_rate: 8,
      tax_amount: 4.0,
      quantity: 8,
      discount_price: 47.99,
    },

    // Hoodie Variants for Canada
    {
      product_variant_id: hoodieSmallGrey,
      country_code: 'CA',
      currency_code: 'CAD',
      price: 59.99,
      tax_rate: 10,
      tax_amount: 6.0,
      quantity: 18,
      discount_price: 57.99,
    },
    {
      product_variant_id: hoodieMediumGrey,
      country_code: 'CA',
      currency_code: 'CAD',
      price: 59.99,
      tax_rate: 10,
      tax_amount: 6.0,
      quantity: 10,
      discount_price: 57.99,
    },
    {
      product_variant_id: hoodieLargeGrey,
      country_code: 'CA',
      currency_code: 'CAD',
      price: 59.99,
      tax_rate: 10,
      tax_amount: 6.0,
      quantity: 12,
      discount_price: 57.99,
    },
    {
      product_variant_id: hoodieSmallBlack,
      country_code: 'CA',
      currency_code: 'CAD',
      price: 59.99,
      tax_rate: 10,
      tax_amount: 6.0,
      quantity: 10,
      discount_price: 57.99,
    },
    {
      product_variant_id: hoodieMediumBlack,
      country_code: 'CA',
      currency_code: 'CAD',
      price: 59.99,
      tax_rate: 10,
      tax_amount: 6.0,
      quantity: 15,
      discount_price: 57.99,
    },
    {
      product_variant_id: hoodieLargeBlack,
      country_code: 'CA',
      currency_code: 'CAD',
      price: 59.99,
      tax_rate: 10,
      tax_amount: 6.0,
      quantity: 8,
      discount_price: 57.99,
    },
  ]);
}
