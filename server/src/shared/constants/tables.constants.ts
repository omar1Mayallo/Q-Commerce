import { ValueOf } from '../types/custom.types';

export const TABLES = {
  USERS: 'Users',
  ADDRESSES: 'Addresses',
  PHONE_NUMBERS: 'PhoneNumbers',

  COUNTRIES: 'Countries',
  CURRENCIES: 'Currencies',
  CATEGORIES: 'Categories',
  ATTRIBUTES: 'Attributes',
  ATTRIBUTE_OPTIONS: 'AttributeOptions',
  PRODUCTS: 'Products',
  PRODUCT_VARIANT_ATTRIBUTES: 'ProductVariantAttributes',
  PRODUCT_VARIANTS: 'ProductVariants',
  PRODUCT_IMAGES: 'ProductImages',
  PRODUCT_REGIONAL_DATA: 'ProductRegionalData',

  HELPFUL_REVIEWS: 'HelpfulReviews',
  RATINGS: 'Ratings',
  REPLIES: 'Replies',
  REVIEWS: 'Reviews',
} as const;

export type TableKeys = ValueOf<typeof TABLES>;
