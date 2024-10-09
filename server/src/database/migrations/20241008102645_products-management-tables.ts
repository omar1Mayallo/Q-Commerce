import { Knex } from 'knex';
import { TABLES } from '../../shared/constants/tables.constants';

export async function up(knex: Knex): Promise<void> {
  // Create Countries Table
  await knex.schema.createTable(TABLES.COUNTRIES, (table) => {
    table.string('country_code').primary();
    table.string('country_name').notNullable();
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
  });

  // Create Attributes Table (needed for CombinationAttributes table)
  await knex.schema.createTable(TABLES.ATTRIBUTES, (table) => {
    table.increments('id').primary();
    table.string('attribute_name').notNullable();
  });

  // Create AttributeOptions Table (needed for CombinationAttributes table)
  await knex.schema.createTable(TABLES.ATTRIBUTE_OPTIONS, (table) => {
    table.increments('id').primary();
    table
      .integer('attribute_id')
      .unsigned()
      .references('id')
      .inTable(TABLES.ATTRIBUTES)
      .onDelete('CASCADE');
    table.string('option_name').notNullable();
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
  });

  // Create CombinationAttributes Table (depends on Combinations, Attributes, and AttributeOptions tables)
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
  });

  // Create ProductRegionalData Table
  await knex.schema.createTable(TABLES.PRODUCT_REGIONAL_DATA, (table) => {
    table.increments('id').primary();
    table
      .integer('combination_id')
      .unsigned()
      .references('id')
      .inTable(TABLES.COMBINATIONS)
      .onDelete('CASCADE');
    table
      .string('country_code')
      .references('country_code')
      .inTable(TABLES.COUNTRIES)
      .onDelete('CASCADE');
    table.decimal('price', 10, 2).notNullable();
    table.decimal('tax_rate', 5, 2).notNullable();
    table.decimal('tax_amount', 10, 2).notNullable();
    table.integer('quantity').notNullable();
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
  await knex.schema.dropTableIfExists(TABLES.COUNTRIES);
}
