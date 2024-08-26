import { Controller } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @DESC: Create a new user
  // @URL: POST => "/users"
  // @Post()
  // async createUser(@Body() body: CreateUserDTO) {
  //   return await this.userService.createUser(body);
  // }

  // // @DESC: Get All Users
  // // @URL: GET => "/users"
  // @Get()
  // @ActionName([USER_ACTIONS.LIST_USERS, ORDERS_ACTIONS.LIST_ORDERS])
  // async getAllUsers(@Query() query: GetAllUsersDTO) {
  //   return await this.userService.getAllUsers(query);
  // }

  // // @DESC: Get LoggedIn User
  // // @URL: GET => "/users/logged"
  // @Get('/logged')
  // @IsAuthenticationGuard()
  // async getLoggedUser(@LoggedUser() user: UserModel) {
  //   return await this.userService.getUser(user.id);
  // }

  // // @DESC: Get User
  // // @URL: PUT => "/users/:id"
  // @Get('/:id')
  // @ActionName(USER_ACTIONS.LIST_USERS)
  // async getUser(@Param() param: IsValidParamIdDTO) {
  //   return await this.userService.getUser(param.id);
  // }

  // // @DESC: Update User
  // // @URL: PUT => "/users/:id"
  // @Put('/:id')
  // @ActionName(USER_ACTIONS.UPDATE_USER)
  // async updateUser(
  //   @Param() param: IsValidParamIdDTO,
  //   @Body() body: UpdateUserDTO,
  // ) {
  //   return await this.userService.updatedUser(param.id, body);
  // }

  // // @DESC: Delete One Or More Users
  // // @URL: DELETE => "/users"
  // @Delete()
  // @ActionName(USER_ACTIONS.DELETE_USERS)
  // async deleteUsers(@Body() body: IsValidArrayIdsDTO) {
  //   await this.userService.deleteUsers(body.ids);
  // }
}
