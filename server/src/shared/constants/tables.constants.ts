import { ValueOf } from '../types/custom.types';

export const TABLES = {
  USERS: 'Users',
  ADDRESSES: 'Addresses',
  PHONE_NUMBERS: 'PhoneNumbers',

  COUNTRIES: 'Countries',
  CATEGORIES: 'Categories',
  PRODUCTS: 'Products',
  COMBINATIONS: 'Combinations',
  COMBINATION_ATTRIBUTES: 'CombinationAttributes',
  PRODUCT_IMAGES: 'ProductImages',
  ATTRIBUTES: 'Attributes',
  ATTRIBUTE_OPTIONS: 'AttributeOptions',
  PRODUCT_REGIONAL_DATA: 'ProductRegionalData',
} as const;

export type TableKeys = ValueOf<typeof TABLES>;
