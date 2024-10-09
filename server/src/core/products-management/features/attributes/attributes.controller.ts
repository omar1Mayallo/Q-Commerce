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
import {
  CreateAttributeDTO,
  UpdateAttributeDTO,
  CreateAttributeOptionDTO,
} from './attributes.dto';
import { AttributesService } from './attributes.service';
import { IsValidParamIdDTO } from 'src/shared/decorators/dtos/IsValidParamId.dto';
import { CustomReqQueryDTO } from 'src/shared/modules/repository/repository.type';
import { IsValidArrayIdsDTO } from 'src/shared/decorators/dtos/IsValidArrayIds.dto';

@Controller('attributes')
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @AllowedTo(UserRolesE.ADMIN)
  async createAttribute(@Body() body: CreateAttributeDTO) {
    return await this.attributesService.createAttribute(body);
  }

  @Get()
  async getAttributes(@Query() query: CustomReqQueryDTO) {
    return await this.attributesService.getAttributes(query);
  }

  @Delete()
  @UseGuards(AuthGuard)
  @AllowedTo(UserRolesE.ADMIN)
  async deleteCategory(@Body() body: IsValidArrayIdsDTO) {
    await this.attributesService.deleteAttributes(body.ids);
  }

  @Get(':id/options')
  async getAttributeOptions(
    @Param() param: IsValidParamIdDTO,
    @Query() query: CustomReqQueryDTO,
  ) {
    return await this.attributesService.getAttributeOptions(param.id, query);
  }

  @Post(':id/options')
  @UseGuards(AuthGuard)
  @AllowedTo(UserRolesE.ADMIN)
  async createAttributeOption(
    @Param() param: IsValidParamIdDTO,
    @Body() body: CreateAttributeOptionDTO,
  ) {
    return await this.attributesService.createAttributeOption(param.id, body);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @AllowedTo(UserRolesE.ADMIN)
  async updateAttribute(
    @Param() param: IsValidParamIdDTO,
    @Body() body: UpdateAttributeDTO,
  ) {
    return await this.attributesService.updateAttribute(param.id, body);
  }
}
