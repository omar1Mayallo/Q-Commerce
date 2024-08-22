import { IsEnum, IsInt, IsString, IsUrl } from 'class-validator';
import { IEnvironmentVariables } from './env.interface';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables implements IEnvironmentVariables {
  // #APP
  @IsEnum(Environment)
  NODE_ENV: Environment;
  @IsInt()
  APP_PORT: number;
  @IsString()
  API_PREFIX: string;
  @IsUrl({
    /*
    TLD stands for "Top-Level Domain." It's the last segment of a domain name, Common TLDs include .com, .org, .net, .edu, .gov ,, For instance, in the URL "www.example.com":
    "www" is the subdomain.
    "example" is the domain name.
    ".com" is the top-level domain.
    */
    require_tld: false,
  })
  SERVER_URL: string;

  // #DB
  @IsString()
  DB_HOST: string;
  @IsInt()
  DB_PORT: number;
  @IsString()
  DB_USER: string;
  @IsString()
  DB_PASSWORD: string;
  @IsString()
  DB_DATABASE: string;

  // #JWT
  @IsString()
  JWT_SECRET: string;
  @IsString()
  JWT_EXPIRATION_DATE: string;
}
