import { ValueOf } from '../types/custom.types';

export const TABLES = {
  USERS: 'Users',
  ADDRESSES: 'Addresses',
  PHONE_NUMBERS: 'PhoneNumbers',
} as const;

export type TableKeys = ValueOf<typeof TABLES>;
