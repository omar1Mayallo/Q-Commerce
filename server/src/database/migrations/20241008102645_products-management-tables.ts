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
      .integer('subcategory_id')
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

  // Create Combinations Table
  await knex.schema.createTable(TABLES.COMBINATIONS, (table) => {
    table.increments('id').primary();
    table
      .integer('product_id')
      .unsigned()
      .references('id')
      .inTable(TABLES.PRODUCTS)
      .onDelete('CASCADE');
    table.timestamps(true, true);
  });

  // Create CombinationAttributes Table
  await knex.schema.createTable(TABLES.COMBINATION_ATTRIBUTES, (table) => {
    table.increments('id').primary();
    table
      .integer('combination_id')
      .unsigned()
      .references('id')
      .inTable(TABLES.COMBINATIONS)
      .onDelete('CASCADE');
    table
      .integer('attribute_id')
      .unsigned()
      .references('id')
      .inTable(TABLES.ATTRIBUTES)
      .onDelete('CASCADE');
    table
      .integer('attribute_value_id')
      .unsigned()
      .references('id')
      .inTable(TABLES.ATTRIBUTE_OPTIONS)
      .onDelete('CASCADE');
    table.timestamps(true, true);
  });

  // Create ProductImages Table
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

  // Create ProductRegionalData Table
  await knex.schema.createTable(TABLES.PRODUCT_REGIONAL_DATA, (table) => {
    table.increments('id').primary();
    table
      .integer('combination_attributes_id')
      .unsigned()
      .references('id')
      .inTable(TABLES.COMBINATION_ATTRIBUTES)
      .onDelete('CASCADE');
    table
      .string('country_code')
      .references('country_code')
      .inTable(TABLES.COUNTRIES)
      .onDelete('CASCADE');
    table
      .integer('currency_id')
      .unsigned()
      .references('id')
      .inTable(TABLES.CURRENCIES)
      .onDelete('CASCADE');
    table.decimal('price', 10, 2).notNullable();
    table.decimal('tax_rate', 5, 2).notNullable();
    table.decimal('tax_amount', 10, 2).notNullable();
    table.integer('quantity').notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(TABLES.PRODUCT_REGIONAL_DATA);
  await knex.schema.dropTableIfExists(TABLES.PRODUCT_IMAGES);
  await knex.schema.dropTableIfExists(TABLES.COMBINATION_ATTRIBUTES);
  await knex.schema.dropTableIfExists(TABLES.COMBINATIONS);
  await knex.schema.dropTableIfExists(TABLES.ATTRIBUTE_OPTIONS);
  await knex.schema.dropTableIfExists(TABLES.ATTRIBUTES);
  await knex.schema.dropTableIfExists(TABLES.PRODUCTS);
  await knex.schema.dropTableIfExists(TABLES.CATEGORIES);
  await knex.schema.dropTableIfExists(TABLES.CURRENCIES);
  await knex.schema.dropTableIfExists(TABLES.COUNTRIES);
}
