import { Knex } from 'knex';
import { TABLES } from '../../shared/constants/tables.constants';

export async function up(knex: Knex): Promise<void> {
  // Create Reviews Table (combining ratings and reviews)
  await knex.schema.createTable(TABLES.REVIEWS, (table) => {
    table.increments('id').primary();
    table
      .integer('product_id')
      .unsigned()
      .references('id')
      .inTable(TABLES.PRODUCTS)
      .onDelete('CASCADE'); // When the product is deleted, reviews will be deleted as well.
    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable(TABLES.USERS)
      .onDelete('CASCADE'); // When a user is deleted, their reviews will also be deleted.
    table.integer('rating').notNullable(); // Rating (1-5)
    table.text('review_text').nullable(); // Optional review text
    table.integer('helpful_count').defaultTo(0); // Track how helpful a review is based on user feedback
    table.boolean('verified_purchase').defaultTo(false); // Whether this review comes from a verified purchase
    table.boolean('is_edited').defaultTo(false); // Whether the review has been edited
    table.timestamps(true, true); // Timestamps for created_at and updated_at
  });

  // Create Replies Table with threading support
  await knex.schema.createTable(TABLES.REPLIES, (table) => {
    table.increments('id').primary();
    table
      .integer('review_id')
      .unsigned()
      .references('id')
      .inTable(TABLES.REVIEWS)
      .onDelete('CASCADE'); // When the review is deleted, associated replies are deleted.
    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable(TABLES.USERS)
      .onDelete('CASCADE'); // When a user is deleted, their replies will also be deleted.
    table
      .integer('parent_reply_id') // New field for threading (optional parent reply)
      .unsigned()
      .nullable()
      .references('id')
      .inTable(TABLES.REPLIES)
      .onDelete('CASCADE'); // When a parent reply is deleted, child replies are deleted as well.
    table.text('reply_text').notNullable(); // The reply content
    table.timestamps(true, true); // Timestamps for created_at and updated_at
  });

  // Create Helpful Table (For marking reviews or replies as helpful)
  await knex.schema.createTable(TABLES.HELPFUL_REVIEWS, (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable(TABLES.USERS)
      .onDelete('CASCADE'); // When user is deleted, their helpful actions are deleted
    table
      .integer('review_id')
      .unsigned()
      .references('id')
      .inTable(TABLES.REVIEWS)
      .onDelete('CASCADE'); // When a review is deleted, helpful marks are deleted
    table.boolean('is_helpful').notNullable(); // Whether the user marked the review as helpful or not
    table.timestamps(true, true); // Timestamps for created_at and updated_at
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(TABLES.HELPFUL_REVIEWS);
  await knex.schema.dropTableIfExists(TABLES.REPLIES);
  await knex.schema.dropTableIfExists(TABLES.REVIEWS);
}
