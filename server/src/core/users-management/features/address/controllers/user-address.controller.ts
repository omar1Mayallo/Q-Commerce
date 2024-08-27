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
import { UserModel } from '../../user/user.type';
import { LoggedUser } from 'src/shared/decorators/custom/logged-user.decorator';
import { AuthGuard } from '../../auth/auth.guard';
import {
  CreateAddressDTO,
  GetAllAddressesDTO,
  UpdateAddressDTO,
} from '../address.dto';
import { UserAddressService } from '../services/user-address.service';

@Controller('users/me/addresses')
@UseGuards(AuthGuard)
export class UserAddressController {
  constructor(private readonly addressService: UserAddressService) {}

  @Post()
  async createAddress(
    @LoggedUser() user: UserModel,
    @Body() body: CreateAddressDTO,
  ) {
    return await this.addressService.createAddress(user.id, body);
  }

  @Get()
  async getLoggedUserAddresses(
    @LoggedUser() user: UserModel,
    @Query() query: GetAllAddressesDTO,
  ) {
    return await this.addressService.getLoggedUserAddresses(user.id, query);
  }

  @Get('/:addressId')
  async getUserAddress(
    @LoggedUser() user: UserModel,
    @Param('addressId') addressId: number,
  ) {
    return await this.addressService.getAddress(user.id, addressId);
  }

  @Put('/:addressId')
  async updateAddress(
    @LoggedUser() user: UserModel,
    @Param('addressId') addressId: number,
    @Body() body: UpdateAddressDTO,
  ) {
    return await this.addressService.updateAddress(user.id, addressId, body);
  }

  @Delete('/:addressId')
  async deleteAddress(
    @LoggedUser() user: UserModel,
    @Param('addressId') addressId: number,
  ) {
    await this.addressService.deleteAddress(user.id, addressId);
  }
}
