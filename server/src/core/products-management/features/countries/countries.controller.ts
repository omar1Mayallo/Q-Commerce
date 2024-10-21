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
import { CreateCountryDTO, UpdateCountryDTO } from './countries.dto';
import { IsValidParamIdDTO } from 'src/shared/decorators/dtos/IsValidParamId.dto';
import { IsValidArrayIdsDTO } from 'src/shared/decorators/dtos/IsValidArrayIds.dto';
import {
  AllowedTo,
  AuthGuard,
} from 'src/core/users-management/features/auth/auth.guard';
import { CountriesService } from './countries.service';
import { CustomReqQueryDTO } from 'src/shared/modules/repository/repository.type';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @AllowedTo(UserRolesE.ADMIN)
  async createCountry(@Body() body: CreateCountryDTO) {
    return await this.countriesService.createCountry(body);
  }

  @Get()
  async getCountries(query: CustomReqQueryDTO) {
    return await this.countriesService.getCountries(query);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @AllowedTo(UserRolesE.ADMIN)
  async updateCountry(
    @Param() param: IsValidParamIdDTO,
    @Body() body: UpdateCountryDTO,
  ) {
    return await this.countriesService.updateCountry(param.id, body);
  }

  @Delete()
  @UseGuards(AuthGuard)
  @AllowedTo(UserRolesE.ADMIN)
  async deleteCountries(@Body() body: IsValidArrayIdsDTO) {
    await this.countriesService.deleteCountries(body.ids);
  }
}
