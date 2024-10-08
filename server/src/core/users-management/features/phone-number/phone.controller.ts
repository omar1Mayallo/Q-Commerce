import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LoggedUser } from 'src/shared/decorators/custom/logged-user.decorator';
import { UserRolesE } from '../../common/constants';
import { AllowedTo, AuthGuard } from '../auth/auth.guard';
import { UserModel } from '../user/user.type';
import { CreatePhoneNumberDTO, GetAllPhoneNumbersDTO } from './phone.dto';
import { PhoneNumbersService } from './phone.service';
import { IsValidArrayIdsDTO } from 'src/shared/decorators/dtos/IsValidArrayIds.dto';

@Controller('phone-numbers')
@UseGuards(AuthGuard)
export class PhoneNumberController {
  constructor(private readonly phoneNumberService: PhoneNumbersService) {}

  @Get()
  @AllowedTo(UserRolesE.ADMIN)
  async getAllPhoneNumbers(@Query() query: GetAllPhoneNumbersDTO) {
    return await this.phoneNumberService.getAllPhoneNumbers(query);
  }

  @Post('/me')
  async createLoggedUserPhoneNumbers(
    @LoggedUser() user: UserModel,
    @Body() body: CreatePhoneNumberDTO,
  ) {
    return await this.phoneNumberService.createLoggedUserPhoneNumbers(
      user.id,
      body,
    );
  }

  @Get('/me')
  async getLoggedUserPhoneNumbers(
    @LoggedUser() user: UserModel,
    @Query() query: GetAllPhoneNumbersDTO,
  ) {
    return await this.phoneNumberService.getLoggedUserPhoneNumbers(
      user.id,
      query,
    );
  }

  @Delete('/me')
  async deleteLoggedUserPhoneNumbers(
    @LoggedUser() user: UserModel,
    @Body() body: IsValidArrayIdsDTO,
  ) {
    return await this.phoneNumberService.deleteLoggedUserPhoneNumbers(
      user.id,
      body.ids,
    );
  }
}
