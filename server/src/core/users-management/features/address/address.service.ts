import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RepositoryService } from 'src/shared/modules/repository/repository.service';
import { TABLES } from 'src/shared/constants/tables.constants';
import { KNEX_CONNECTION } from 'src/database/database.provider';
import { Knex } from 'knex';
import { AddressModel } from './address.type';
import {
  CreateAddressDTO,
  GetAllAddressesDTO,
  UpdateAddressDTO,
} from './address.dto';

@Injectable()
export class AddressService {
  constructor(
    private readonly repoService: RepositoryService<AddressModel>,
    @Inject(KNEX_CONNECTION)
    private readonly knex: Knex,
  ) {}

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

  async deleteAddress(userId: number, ids: number[]) {
    const addressIds = await this.knex<AddressModel>(TABLES.ADDRESSES)
      .whereIn('id', ids)
      .andWhere('user_id', userId)
      .pluck('id');

    const allBelongToUser = ids.every((id) => addressIds.includes(id));

    if (!allBelongToUser) {
      throw new BadRequestException(
        'Addresses not found or not belongs to your account',
      );
    }

    return await this.repoService.deleteByIds(TABLES.ADDRESSES, ids);
  }
}
