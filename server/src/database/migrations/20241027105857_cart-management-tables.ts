import { Knex } from 'knex';
import { TABLES } from '../../shared/constants/tables.constants';

export async function up(knex: Knex): Promise<void> {
  // Create Carts Table
  await knex.schema.createTable(TABLES.CARTS, (table) => {
    table.increments('id').primary();

    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable(TABLES.USERS)
      .onDelete('CASCADE'); // If a user is deleted, their cart is also deleted

    table.timestamps(true, true); // Timestamps for created_at and updated_at
  });

  // Create CartItems Table
  await knex.schema.createTable(TABLES.CART_ITEMS, (table) => {
    table.increments('id').primary();

    table
      .integer('cart_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable(TABLES.CARTS)
      .onDelete('CASCADE'); // If a cart is deleted, its items are also deleted

    table
      .integer('product_variant_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable(TABLES.PRODUCT_VARIANTS)
      .onDelete('CASCADE'); // If a product variant is deleted, it’s removed from the cart

    table.integer('quantity').notNullable().defaultTo(1); // Quantity of the product variant

    table.timestamps(true, true); // Timestamps for created_at and updated_at

    table.unique(['cart_id', 'product_variant_id']); // Prevents duplicate items in the same cart
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(TABLES.CART_ITEMS);
  await knex.schema.dropTableIfExists(TABLES.CARTS);
}
