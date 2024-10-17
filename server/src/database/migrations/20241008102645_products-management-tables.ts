import { Knex } from 'knex';
import { TABLES } from '../../shared/constants/tables.constants';

export async function up(knex: Knex): Promise<void> {
  // Create Countries Table
  await knex.schema.createTable(TABLES.COUNTRIES, (table) => {
    table.increments('id').primary();
    table.string('country_code').unique().notNullable();
    table.string('country_name').notNullable();
    table.timestamps(true, true);
  });

  // Create Currencies Table
  await knex.schema.createTable(TABLES.CURRENCIES, (table) => {
    table.increments('id').primary();
    table.string('currency_code').unique().notNullable();
    table.string('currency_name').notNullable();
    table.decimal('exchange_rate', 10, 4).notNullable(); // Exchange rate relative to a base currency, like USD
    table.timestamps(true, true);
  });

  // Create Categories Table
  await knex.schema.createTable(TABLES.CATEGORIES, (table) => {
    table.increments('id').primary();
    table
      .integer('parent_category_id')
      .unsigned()
      .references('id')
      .inTable(TABLES.CATEGORIES)
      .onDelete('CASCADE');
    table.string('category_name').notNullable();
    table.string('category_description').nullable();
    table.string('category_img').nullable();
    table.timestamps(true, true);
  });

  // Create Products Table
  await knex.schema.createTable(TABLES.PRODUCTS, (table) => {
    table.increments('id').primary();
    table
      .integer('category_id')
      .unsigned()
      .references('id')
      .inTable(TABLES.CATEGORIES)
      .onDelete('CASCADE');
    table.string('product_name').notNullable();
    table.text('product_description').nullable();
    table.decimal('base_price', 10, 2).notNullable();
    table.integer('base_quantity').notNullable();
    table.decimal('base_tax_rate', 5, 2).notNullable();
    table.decimal('base_tax_amount', 10, 2).notNullable();
    table.timestamps(true, true);
  });

  // Create Attributes Table
  await knex.schema.createTable(TABLES.ATTRIBUTES, (table) => {
    table.increments('id').primary();
    table.string('attribute_name').notNullable();
    table.timestamps(true, true);
  });

  // Create AttributeOptions Table
  await knex.schema.createTable(TABLES.ATTRIBUTE_OPTIONS, (table) => {
    table.increments('id').primary();
    table
      .integer('attribute_id')
      .unsigned()
      .references('id')
      .inTable(TABLES.ATTRIBUTES)
      .onDelete('CASCADE');
    table.string('option_name').notNullable();
    table.timestamps(true, true);
  });

  // Create Product Variants Table
  await knex.schema.createTable(TABLES.PRODUCT_VARIANTS, (table) => {
    table.increments('id').primary();
    table
      .integer('product_id')
      .unsigned()
      .references('id')
      .inTable(TABLES.PRODUCTS)
      .onDelete('CASCADE');
    table.string('sku').unique().notNullable();
    table.string('unique_variant_name').notNullable(); // Combination of attribute names
    table.timestamps(true, true);
  });

  // Create Product Variant Attributes Table
  await knex.schema.createTable(TABLES.PRODUCT_VARIANT_ATTRIBUTES, (table) => {
    table.increments('id').primary();
    table
      .integer('product_variant_id')
      .unsigned()
      .references('id')
      .inTable(TABLES.PRODUCT_VARIANTS)
      .onDelete('CASCADE');
    table
      .integer('attribute_id')
      .unsigned()
      .references('id')
      .inTable(TABLES.ATTRIBUTES)
      .onDelete('CASCADE');
    table
      .integer('attribute_option_id')
      .unsigned()
      .references('id')
      .inTable(TABLES.ATTRIBUTE_OPTIONS)
      .onDelete('CASCADE');
    table.timestamps(true, true);
  });

  // Create Product Regional Data Table
  await knex.schema.createTable(TABLES.PRODUCT_REGIONAL_DATA, (table) => {
    table.increments('id').primary();
    table
      .integer('product_variant_id')
      .unsigned()
      .references('id')
      .inTable(TABLES.PRODUCT_VARIANTS)
      .onDelete('CASCADE');
    table
      .string('country_code')
      .references('country_code')
      .inTable(TABLES.COUNTRIES)
      .onDelete('CASCADE');
    table
      .string('currency_code')
      .references('currency_code')
      .inTable(TABLES.CURRENCIES)
      .onDelete('CASCADE');
    table.decimal('price', 10, 2).notNullable();
    table.decimal('tax_rate', 5, 2).notNullable();
    table.decimal('tax_amount', 10, 2).notNullable();
    table.integer('quantity').notNullable();
    table.timestamps(true, true);
  });

  // Create Product Images Table
  await knex.schema.createTable(TABLES.PRODUCT_IMAGES, (table) => {
    table.increments('id').primary();
    table
      .integer('product_id')
      .unsigned()
      .references('id')
      .inTable(TABLES.PRODUCTS)
      .onDelete('CASCADE');
    table.string('img_url').notNullable();
    table.string('img_type').nullable();
    table.integer('img_order').nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(TABLES.PRODUCT_IMAGES);
  await knex.schema.dropTableIfExists(TABLES.PRODUCT_REGIONAL_DATA);
  await knex.schema.dropTableIfExists(TABLES.PRODUCT_VARIANT_ATTRIBUTES);
  await knex.schema.dropTableIfExists(TABLES.PRODUCT_VARIANTS);
  await knex.schema.dropTableIfExists(TABLES.ATTRIBUTE_OPTIONS);
  await knex.schema.dropTableIfExists(TABLES.ATTRIBUTES);
  await knex.schema.dropTableIfExists(TABLES.PRODUCTS);
  await knex.schema.dropTableIfExists(TABLES.CATEGORIES);
  await knex.schema.dropTableIfExists(TABLES.CURRENCIES);
  await knex.schema.dropTableIfExists(TABLES.COUNTRIES);
}
