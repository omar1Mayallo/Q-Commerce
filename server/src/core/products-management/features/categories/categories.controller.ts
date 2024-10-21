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
import { UserRolesE } from 'src/core/users-management/common/constants';
import {
  AllowedTo,
  AuthGuard,
} from 'src/core/users-management/features/auth/auth.guard';
import { CustomReqQueryDTO } from 'src/shared/modules/repository/repository.type';
import { CreateCategoryDTO, UpdateCategoryDTO } from './categories.dto';
import { CategoriesService } from './categories.service';
import { IsValidParamIdDTO } from 'src/shared/decorators/dtos/IsValidParamId.dto';
import { IsValidArrayIdsDTO } from 'src/shared/decorators/dtos/IsValidArrayIds.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @AllowedTo(UserRolesE.ADMIN)
  async createCategory(@Body() body: CreateCategoryDTO) {
    return await this.categoriesService.createCategory(body);
  }

  @Get()
  async getCategories(@Query() query: CustomReqQueryDTO) {
    return await this.categoriesService.getCategories(query);
  }

  @Get(':id/subcategories')
  async getSubcategoriesOfCategory(
    @Param() param: IsValidParamIdDTO,
    @Query() query: CustomReqQueryDTO,
  ) {
    return await this.categoriesService.getSubcategoriesOfCategory(
      param.id,
      query,
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @AllowedTo(UserRolesE.ADMIN)
  async updateCategory(
    @Param() param: IsValidParamIdDTO,
    @Body() body: UpdateCategoryDTO,
  ) {
    return await this.categoriesService.updateCategory(param.id, body);
  }

  @Delete()
  @UseGuards(AuthGuard)
  @AllowedTo(UserRolesE.ADMIN)
  async deleteCategory(@Body() body: IsValidArrayIdsDTO) {
    await this.categoriesService.deleteCategory(body.ids);
  }
}
