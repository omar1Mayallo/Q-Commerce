import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from 'src/database/database.provider';
import { TABLES } from 'src/shared/constants/tables.constants';
import { RepositoryService } from 'src/shared/modules/repository/repository.service';
import { CustomReqQueryDTO } from 'src/shared/modules/repository/repository.type';
import {
  CreateAttributeDTO,
  CreateAttributeOptionDTO,
  UpdateAttributeDTO,
} from './attributes.dto';
import { AttributeModel, AttributeOptionModel } from './attributes.type';

@Injectable()
export class AttributesService {
  constructor(
    private readonly attributeRepoService: RepositoryService<AttributeModel>,
    private readonly optionRepoService: RepositoryService<AttributeOptionModel>,
    @Inject(KNEX_CONNECTION)
    private readonly knex: Knex,
  ) {}

  async createAttribute(body: CreateAttributeDTO) {
    return await this.attributeRepoService.createOne(TABLES.ATTRIBUTES, body);
  }

  async getAttributes(query: CustomReqQueryDTO) {
    return await this.attributeRepoService.getAll(TABLES.ATTRIBUTES, query);
  }

  async getAttributeOptions(id: number, query: CustomReqQueryDTO) {
    return await this.optionRepoService.getAll(TABLES.ATTRIBUTE_OPTIONS, {
      ...query,
      attribute_id: String(id),
    });
  }

  async createAttributeOption(id: number, body: CreateAttributeOptionDTO) {
    await this.attributeRepoService.getOne(TABLES.ATTRIBUTES, { id });
    return await this.optionRepoService.createOne(TABLES.ATTRIBUTE_OPTIONS, {
      ...body,
      attribute_id: id,
    });
  }

  async updateAttribute(id: number, body: UpdateAttributeDTO) {
    await this.attributeRepoService.getOne(TABLES.ATTRIBUTES, { id });
    return await this.attributeRepoService.updateOne(
      TABLES.ATTRIBUTES,
      { id },
      body,
    );
  }

  async deleteAttributes(ids: number[]) {
    return await this.attributeRepoService.deleteByIds(TABLES.ATTRIBUTES, ids);
  }
}
