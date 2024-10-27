import { Knex } from 'knex';
import { TABLES } from '../../shared/constants/tables.constants';

export async function up(knex: Knex): Promise<void> {
  // Create Wishlists Table (Join table between Users and Products)
  await knex.schema.createTable(TABLES.WISHLISTS, (table) => {
    table.increments('id').primary();

    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable(TABLES.USERS)
      .onDelete('CASCADE'); // When a user is deleted, their wishlist is deleted

    table.timestamps(true, true); // Timestamps for created_at and updated_at
  });

  // Create Wishlist Items Table (Wishlist can have multiple items)
  await knex.schema.createTable(TABLES.WISHLIST_ITEMS, (table) => {
    table.increments('id').primary();

    table
      .integer('wishlist_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable(TABLES.WISHLISTS)
      .onDelete('CASCADE'); // When a wishlist is deleted, its items are deleted

    table
      .integer('product_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable(TABLES.PRODUCTS)
      .onDelete('CASCADE'); // When a product is deleted, it's removed from all wishlists

    table.timestamps(true, true); // Timestamps for created_at and updated_at

    table.unique(['wishlist_id', 'product_id']); // Ensure a product can't be added to a wishlist more than once
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(TABLES.WISHLIST_ITEMS);
  await knex.schema.dropTableIfExists(TABLES.WISHLISTS);
}
