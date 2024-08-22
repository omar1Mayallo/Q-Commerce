import { ConfigModuleOptions } from '@nestjs/config';
import { validate } from './env.validation';

export const ConfigOptions: ConfigModuleOptions = {
  isGlobal: true,
  validate,
};