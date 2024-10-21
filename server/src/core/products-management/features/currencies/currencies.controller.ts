import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserRolesE } from 'src/core/users-management/common/constants';
import { CreateCurrencyDTO, UpdateCurrencyDTO } from './currencies.dto';
import { IsValidParamIdDTO } from 'src/shared/decorators/dtos/IsValidParamId.dto';
import { IsValidArrayIdsDTO } from 'src/shared/decorators/dtos/IsValidArrayIds.dto';
import {
  AllowedTo,
  AuthGuard,
} from 'src/core/users-management/features/auth/auth.guard';
import { CurrenciesService } from './currencies.service';
import { CustomReqQueryDTO } from 'src/shared/modules/repository/repository.type';

@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @AllowedTo(UserRolesE.ADMIN)
  async createCurrency(@Body() body: CreateCurrencyDTO) {
    return await this.currenciesService.createCurrency(body);
  }

  @Get()
  async getCurrencies(query: CustomReqQueryDTO) {
    return await this.currenciesService.getCurrencies(query);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @AllowedTo(UserRolesE.ADMIN)
  async updateCurrency(
    @Param() param: IsValidParamIdDTO,
    @Body() body: UpdateCurrencyDTO,
  ) {
    return await this.currenciesService.updateCurrency(param.id, body);
  }

  @Delete()
  @UseGuards(AuthGuard)
  @AllowedTo(UserRolesE.ADMIN)
  async deleteCurrencies(@Body() body: IsValidArrayIdsDTO) {
    await this.currenciesService.deleteCurrencies(body.ids);
  }
}
