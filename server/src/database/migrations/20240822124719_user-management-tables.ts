import { Knex } from 'knex';
import { TABLES } from '../../shared/constants/tables.constants';
import { UserRolesE } from '../../core/users-management/common/constants';
import { PhoneType } from 'src/core/users-management/features/phone-number/phone.type';

export async function up(knex: Knex): Promise<void> {
  // Create Users Table
  await knex.schema.createTable(TABLES.USERS, (table) => {
    table.increments('id').primary();
    table.string('username').notNullable();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.string('role').notNullable().defaultTo(UserRolesE.USER);
    table.string('avatar').nullable();
    table.timestamps(true, true);
  });

  // Create Addresses Table
  await knex.schema.createTable(TABLES.ADDRESSES, (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable(TABLES.USERS)
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.string('street').notNullable();
    table.string('city').notNullable();
    table.string('postal_code').notNullable();
    table.string('country').notNullable();
    table.timestamps(true, true);
  });

  // Create PhoneNumbers Table
  await knex.schema.createTable(TABLES.PHONE_NUMBERS, (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable(TABLES.USERS)
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.string('phone_number').notNullable();
    table.string('country_code').notNullable();
    table.string('type').notNullable().defaultTo(PhoneType.SMS); // Type of phone number (e.g., 'WhatsApp', 'SMS')
    table.boolean('marketing_opt_in').defaultTo(false); // Opt-in for marketing communications
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  // Drop PhoneNumbers Table
  await knex.schema.dropTableIfExists(TABLES.PHONE_NUMBERS);

  // Drop Addresses Table
  await knex.schema.dropTableIfExists(TABLES.ADDRESSES);

  // Drop Users Table
  await knex.schema.dropTableIfExists(TABLES.USERS);
}
