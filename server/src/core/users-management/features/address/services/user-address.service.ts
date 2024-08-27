import { BadRequestException, Injectable } from '@nestjs/common';
import { RepositoryService } from 'src/shared/modules/repository/repository.service';
import { AddressModel } from '../address.type';
import { TABLES } from 'src/shared/constants/tables.constants';
import {
  CreateAddressDTO,
  GetAllAddressesDTO,
  UpdateAddressDTO,
} from '../address.dto';

@Injectable()
export class UserAddressService {
  constructor(private readonly repoService: RepositoryService<AddressModel>) {}

  async createAddress(userId: number, body: CreateAddressDTO) {
    const newAddress = { ...body, user_id: userId };

    return await this.repoService.createOne(TABLES.ADDRESSES, newAddress);
  }

  async getLoggedUserAddresses(userId: number, query: GetAllAddressesDTO) {
    return await this.repoService.getAll(TABLES.ADDRESSES, {
      ...query,
      user_id: String(userId),
    });
  }

  async getAddress(userId: number, addressId: number) {
    return await this.repoService.getOne(TABLES.ADDRESSES, {
      id: addressId,
      user_id: userId,
    });
  }

  async updateAddress(
    userId: number,
    addressId: number,
    body: UpdateAddressDTO,
  ) {
    const address = await this.repoService.getOne(TABLES.ADDRESSES, {
      id: addressId,
      user_id: userId,
    });
    if (!address) {
      throw new BadRequestException('This address do not belong to the user');
    }

    return await this.repoService.updateOne(
      TABLES.ADDRESSES,
      { id: addressId, user_id: userId },
      body,
    );
  }

  async deleteAddress(userId: number, addressId: number) {
    const address = await this.repoService.getOne(TABLES.ADDRESSES, {
      id: addressId,
      user_id: userId,
    });
    if (!address) {
      throw new BadRequestException('This address do not belong to the user');
    }

    return await this.repoService.deleteByIds(TABLES.ADDRESSES, [addressId]);
  }
}
