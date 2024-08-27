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
import { UserService } from './user.service';
import {
  UpdateLoggedUserPasswordDTO,
  CreateUserDTO,
  GetAllUsersDTO,
  UpdateUserDTO,
  UpdateLoggedUserProfileDTO,
} from './user.dto';
import { IsValidParamIdDTO } from 'src/shared/decorators/dtos/IsValidParamId.dto';
import { LoggedUser } from 'src/shared/decorators/custom/logged-user.decorator';
import { UserModel } from './user.type';
import { IsValidArrayIdsDTO } from 'src/shared/decorators/dtos/IsValidArrayIds.dto';
import { AllowedTo, AuthGuard } from '../auth/auth.guard';
import { UserRolesE } from '../../common/constants';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @AllowedTo(UserRolesE.ADMIN)
  async createUser(@Body() body: CreateUserDTO) {
    return await this.userService.createUser(body);
  }

  @Get()
  @AllowedTo(UserRolesE.ADMIN)
  async getAllUsers(@Query() query: GetAllUsersDTO) {
    return await this.userService.getAllUsers(query);
  }

  @Get('/:id')
  @AllowedTo(UserRolesE.ADMIN)
  async getUser(@Param() param: IsValidParamIdDTO) {
    return await this.userService.getUser(param.id);
  }

  @Put('/:id')
  @AllowedTo(UserRolesE.ADMIN)
  async updateUser(
    @Param() param: IsValidParamIdDTO,
    @Body() body: UpdateUserDTO,
  ) {
    return await this.userService.updateUser(param.id, body);
  }

  @Delete()
  @AllowedTo(UserRolesE.ADMIN)
  async deleteUsers(@Body() body: IsValidArrayIdsDTO) {
    await this.userService.deleteUsers(body.ids);
  }

  @Get('/logged-in')
  async getLoggedUser(@LoggedUser() user: UserModel) {
    return await this.userService.getUser(user.id);
  }

  @Put('/logged-in/profile')
  async updateLoggedUserProfile(
    @LoggedUser() user: UserModel,
    @Body() body: UpdateLoggedUserProfileDTO,
  ) {
    return await this.userService.updateLoggedUserProfile(user.id, body);
  }

  @Put('/logged-in/password')
  async changeLoggedUserPassword(
    @LoggedUser() user: UserModel,
    @Body() body: UpdateLoggedUserPasswordDTO,
  ) {
    return await this.userService.updateLoggedUserPassword(user.id, body);
  }
}
