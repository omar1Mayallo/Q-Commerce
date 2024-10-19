import { Knex } from 'knex';
import { TABLES } from '../../shared/constants/tables.constants';

export async function up(knex: Knex): Promise<void> {
  // Create Reviews Table
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
    table.integer('rating').notNullable(); // Directly store the rating in the Reviews table
    table.text('review_text').nullable();
    table.integer('helpful_count').defaultTo(0); // Track how helpful a review is based on user feedback
    table.boolean('verified_purchase').defaultTo(false); // Whether this review comes from a verified purchase
    table.timestamps(true, true);
  });

  // Create Replies Table
  await knex.schema.createTable(TABLES.REPLIES, (table) => {
    table.increments('id').primary();
    table
      .integer('review_id')
      .unsigned()
      .references('id')
      .inTable(TABLES.REVIEWS)
      .onDelete('CASCADE'); // When the review is deleted, associated replies are deleted
    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable(TABLES.USERS)
      .onDelete('CASCADE'); // When a user is deleted, their replies will also be deleted.
    table.text('reply_text').notNullable();
    table.boolean('verified_purchase').defaultTo(false); // Whether the user making the reply had a verified purchase
    table.timestamps(true, true);
  });

  // Create Ratings Table (Optional, in case you want to keep ratings separate from reviews)
  await knex.schema.createTable(TABLES.RATINGS, (table) => {
    table.increments('id').primary();
    table
      .integer('product_id')
      .unsigned()
      .references('id')
      .inTable(TABLES.PRODUCTS)
      .onDelete('CASCADE'); // If product is deleted, ratings will be deleted as well.
    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable(TABLES.USERS)
      .onDelete('CASCADE'); // If user is deleted, their ratings will be deleted.
    table.integer('rating').notNullable(); // 1-5 rating
    table.timestamps(true, true);
  });

  // Create Helpful Table (Optional, for marking reviews or replies as helpful)
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
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(TABLES.HELPFUL_REVIEWS);
  await knex.schema.dropTableIfExists(TABLES.RATINGS);
  await knex.schema.dropTableIfExists(TABLES.REPLIES);
  await knex.schema.dropTableIfExists(TABLES.REVIEWS);
}
