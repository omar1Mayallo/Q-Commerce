import { Module } from '@nestjs/common';
import { ConfigOptions } from './config/env/env.config';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { RepositoryModule } from './shared/modules/repository/repository.module';
import { HelpersModule } from './shared/modules/helpers/helpers.module';
import { I18nCustomModule } from './shared/modules/i18n/i18n.module';
import { UserModule } from './core/users-management/features/user/user.module';
import { AuthModule } from './core/users-management/features/auth/auth.module';
import { AddressModule } from './core/users-management/features/address/address.module';
import { PhoneNumberModule } from './core/users-management/features/phone-number/phone.module';
import { CategoriesModule } from './core/products-management/features/categories/categories.module';
import { AttributesModule } from './core/products-management/features/attributes/attributes.module';

@Module({
  imports: [
    ConfigModule.forRoot(ConfigOptions),
    I18nCustomModule,
    DatabaseModule,
    RepositoryModule,
    HelpersModule,

    UserModule,
    AuthModule,
    AddressModule,
    PhoneNumberModule,
    CategoriesModule,
    AttributesModule,
  ],
})
export class AppModule {}
