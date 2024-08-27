import { Module } from '@nestjs/common';
import { UserAddressController } from './controllers/user-address.controller';
import { AddressController } from './controllers/address.controller';
import { AddressService } from './services/address.service';
import { UserAddressService } from './services/user-address.service';

@Module({
  controllers: [AddressController, UserAddressController],
  providers: [AddressService, UserAddressService],
})
export class AddressModule {}
