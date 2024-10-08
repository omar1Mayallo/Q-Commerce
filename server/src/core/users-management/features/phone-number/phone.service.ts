import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from 'src/database/database.provider';
import { TABLES } from 'src/shared/constants/tables.constants';
import { RepositoryService } from 'src/shared/modules/repository/repository.service';
import { PhoneNumberModel, PhoneType } from './phone.type';
import { CreatePhoneNumberDTO, GetAllPhoneNumbersDTO } from './phone.dto';

@Injectable()
export class PhoneNumbersService {
  constructor(
    @Inject(KNEX_CONNECTION)
    private readonly knex: Knex,
    private readonly repoService: RepositoryService<PhoneNumberModel>,
  ) {}
  async getAllPhoneNumbers(query: GetAllPhoneNumbersDTO) {
    return await this.repoService.getAll(TABLES.PHONE_NUMBERS, query);
  }

  async createLoggedUserPhoneNumbers(
    userId: number,
    body: CreatePhoneNumberDTO,
  ) {
    const newPhoneNumber = {
      user_id: userId,
      phone_number: body.phone_number,
      country_code: body.country_code,
      type: body.type || PhoneType.SMS,
      marketing_opt_in: body.marketing_opt_in || false,
    };
    return await this.repoService.createOne(
      TABLES.PHONE_NUMBERS,
      newPhoneNumber,
    );
  }

  async getLoggedUserPhoneNumbers(
    userId: number,
    query: GetAllPhoneNumbersDTO,
  ) {
    return await this.repoService.getAll(TABLES.PHONE_NUMBERS, {
      ...query,
      user_id: String(userId),
    });
  }

  async deleteLoggedUserPhoneNumbers(userId: number, ids: number[]) {
    const phoneNumbers = await this.knex<PhoneNumberModel>(TABLES.PHONE_NUMBERS)
      .whereIn('id', ids)
      .andWhere('user_id', userId)
      .pluck('id');

    const allBelongToUser = ids.every((id) => phoneNumbers.includes(id));

    if (!allBelongToUser) {
      throw new BadRequestException(
        'One or more phone numbers do not belong to the user',
      );
    }

    return await this.repoService.deleteByIds(TABLES.PHONE_NUMBERS, ids);
  }
}
