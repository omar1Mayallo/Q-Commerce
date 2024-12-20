import { WishlistModule } from './core/wishlist-management/wishlist.module';
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
import { CountriesModule } from './core/products-management/features/countries/countries.module';
import { CurrenciesModule } from './core/products-management/features/currencies/currencies.module';
import { ProductsModule } from './core/products-management/features/products/products.module';
import { RatingsModule } from './core/ratings-management/ratings.module';
import { CartModule } from './core/cart-management/cart.module';

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
    CountriesModule,
    CurrenciesModule,
    ProductsModule,
    RatingsModule,
    WishlistModule,
    CartModule,
  ],
})
export class AppModule {}
