import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from 'src/database/database.provider';
import { TABLES } from 'src/shared/constants/tables.constants';
import { RepositoryService } from 'src/shared/modules/repository/repository.service';
import { CustomReqQueryDTO } from 'src/shared/modules/repository/repository.type';
import { CreateCurrencyDTO, UpdateCurrencyDTO } from './currencies.dto';
import { CurrencyModel } from './currencies.type';

@Injectable()
export class CurrenciesService {
  constructor(
    private readonly repoService: RepositoryService<CurrencyModel>,
    @Inject(KNEX_CONNECTION)
    private readonly knex: Knex,
  ) {}

  async createCurrency(body: CreateCurrencyDTO) {
    return await this.repoService.createOne(TABLES.CURRENCIES, body);
  }

  async getCurrencies(query: CustomReqQueryDTO) {
    return await this.repoService.getAll(TABLES.CURRENCIES, { ...query });
  }

  async updateCurrency(id: number, data: UpdateCurrencyDTO) {
    return await this.repoService.updateOne(TABLES.CURRENCIES, { id }, data);
  }

  async deleteCurrencies(ids: number[]) {
    return await this.repoService.deleteByIds(TABLES.CURRENCIES, ids);
  }
}
