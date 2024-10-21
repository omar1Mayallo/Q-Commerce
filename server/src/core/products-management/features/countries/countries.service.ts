import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from 'src/database/database.provider';
import { TABLES } from 'src/shared/constants/tables.constants';
import { RepositoryService } from 'src/shared/modules/repository/repository.service';
import { CustomReqQueryDTO } from 'src/shared/modules/repository/repository.type';
import { CreateCountryDTO, UpdateCountryDTO } from './countries.dto';
import { CountryModel } from './countries.type';

@Injectable()
export class CountriesService {
  constructor(
    private readonly repoService: RepositoryService<CountryModel>,
    @Inject(KNEX_CONNECTION)
    private readonly knex: Knex,
  ) {}

  async createCountry(body: CreateCountryDTO) {
    return await this.repoService.createOne(TABLES.COUNTRIES, body);
  }

  async getCountries(query: CustomReqQueryDTO) {
    return await this.repoService.getAll(TABLES.COUNTRIES, { ...query });
  }

  async updateCountry(id: number, data: UpdateCountryDTO) {
    return await this.repoService.updateOne(TABLES.COUNTRIES, { id }, data);
  }

  async deleteCountries(ids: number[]) {
    return await this.repoService.deleteByIds(TABLES.COUNTRIES, ids);
  }
}
