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
}
