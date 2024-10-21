import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from 'src/database/database.provider';
import { TABLES } from 'src/shared/constants/tables.constants';
import { RepositoryService } from 'src/shared/modules/repository/repository.service';
import { CustomReqQueryDTO } from 'src/shared/modules/repository/repository.type';
import { CreateCategoryDTO, UpdateCategoryDTO } from './categories.dto';
import { CategoryModel } from './categories.type';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly repoService: RepositoryService<CategoryModel>,
    @Inject(KNEX_CONNECTION)
    private readonly knex: Knex,
  ) {}

  async createCategory(body: CreateCategoryDTO) {
    if (body.parent_category_id) {
      const parentCategory = await this.repoService.getOne(TABLES.CATEGORIES, {
        id: body.parent_category_id,
      });

      if (!parentCategory) {
        throw new NotFoundException('Parent category not found');
      }
    }
    return await this.repoService.createOne(TABLES.CATEGORIES, body);
  }

  async getCategories(query: CustomReqQueryDTO) {
    return await this.repoService.getAll(TABLES.CATEGORIES, {
      ...query,
      parent_category_id: null,
    });
  }

  async getSubcategoriesOfCategory(parentId: number, query: CustomReqQueryDTO) {
    return await this.repoService.getAll(TABLES.CATEGORIES, {
      ...query,
      parent_category_id: String(parentId),
    });
  }

  async updateCategory(id: number, data: UpdateCategoryDTO) {
    await this.repoService.getOne(TABLES.CATEGORIES, { id });

    if (data.parent_category_id) {
      await this.repoService.getOne(TABLES.CATEGORIES, {
        id: data.parent_category_id,
      });
    }

    return await this.repoService.updateOne(TABLES.CATEGORIES, { id }, data);
  }

  async deleteCategory(ids: number[]) {
    return await this.repoService.deleteByIds(TABLES.CATEGORIES, ids);
  }
}
