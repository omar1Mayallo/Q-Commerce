import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserModel } from '../user/user.type';
import { LoggedUser } from 'src/shared/decorators/custom/logged-user.decorator';
import { AuthGuard } from '../auth/auth.guard';
import {
  CreateAddressDTO,
  GetAllAddressesDTO,
  UpdateAddressDTO,
} from './address.dto';
import { AddressService } from './address.service';
import { IsValidArrayIdsDTO } from 'src/shared/decorators/dtos/IsValidArrayIds.dto';

@Controller('addresses')
@UseGuards(AuthGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post('/me')
  async createAddress(
    @LoggedUser() user: UserModel,
    @Body() body: CreateAddressDTO,
  ) {
    return await this.addressService.createAddress(user.id, body);
  }

  @Get('/me')
  async getLoggedUserAddresses(
    @LoggedUser() user: UserModel,
    @Query() query: GetAllAddressesDTO,
  ) {
    return await this.addressService.getLoggedUserAddresses(user.id, query);
  }

  @Delete('/me')
  async deleteLoggedUserAddresses(
    @LoggedUser() user: UserModel,
    @Body() body: IsValidArrayIdsDTO,
  ) {
    await this.addressService.deleteAddress(user.id, body.ids);
  }

  @Get('/me/:addressId')
  async getLoggedUserUserAddress(
    @LoggedUser() user: UserModel,
    @Param('addressId') addressId: number,
  ) {
    return await this.addressService.getAddress(user.id, addressId);
  }

  @Put('/me/:addressId')
  async updateLoggedUserAddress(
    @LoggedUser() user: UserModel,
    @Param('addressId') addressId: number,
    @Body() body: UpdateAddressDTO,
  ) {
    return await this.addressService.updateAddress(user.id, addressId, body);
  }
}
