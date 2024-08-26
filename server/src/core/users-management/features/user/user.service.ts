import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from 'src/database/database.provider';

@Injectable()
export class UserService {
  constructor(
    @Inject(KNEX_CONNECTION)
    private readonly knex: Knex,
  ) {}

  // async createUser(body: CreateUserDTO) {
  //   if (body.role === USER_ROLE.OWNER) {
  //     throw new BadRequestException(
  //       this.i18nService.t('errors.Http_Errors.CANT_CREATE_OWNER_USER'),
  //     );
  //   }

  //   // 1) Check If Email already exists
  //   const emailExist = await this.repoService.getOne(
  //     TABLES.USERS,
  //     {
  //       email: body.email,
  //     },
  //     { withNotFoundError: false },
  //   );
  //   if (emailExist) {
  //     throw new BadRequestException(
  //       this.i18nService.t('errors.Http_Errors.EMAIL_UNIQUE'),
  //     );
  //   }

  //   // 2) Hash the password before Inserting
  //   const hashedPassword = await this.bcryptService.hash(body.password);

  //   return await this.knex.transaction(async (trx) => {
  //     // 3) Create a new user
  //     const newUser = { ...body, password: hashedPassword };
  //     const [createdUser] = await trx<UserModel>(TABLES.USERS)
  //       .insert(newUser)
  //       .returning('*');

  //     // 4) Create a new user_actions
  //     const userActions = this.getUserActionsByUserRole(createdUser.role);
  //     const newUserActions = userActions.map((action) => ({
  //       email: createdUser.email,
  //       action_key: action,
  //     }));

  //     if (newUserActions.length > 0) {
  //       await trx(TABLES.USER_ENTITY_ACTION).insert(newUserActions);
  //     }

  //     return createdUser;
  //   });
  // }

  // async getAllUsers(query: GetAllUsersDTO) {
  //   return await this.repoService.getAll(TABLES.USERS, query);
  // }

  // async getUser(id: number) {
  //   const user = await this.repoService.getOne(TABLES.USERS, { id });
  //   delete user.password;
  //   return user;
  // }

  // async deleteUsers(ids: number[]) {
  //   const usersRoles = await this.knex<UserModel>(TABLES.USERS)
  //     .whereIn('id', ids)
  //     .select('role')
  //     .pluck('role');

  //   if (usersRoles.includes(USER_ROLE.OWNER)) {
  //     throw new BadRequestException(
  //       this.i18nService.t('errors.Http_Errors.CANT_DELETE_OWNER'),
  //     );
  //   }

  //   await this.repoService.deleteByIds(TABLES.USERS, ids);

  //   return { message: 'success' };
  // }

  // async updatedUser(id: number, body: UpdateUserDTO) {
  //   const user = await this.getUser(id);

  //   if (user.role !== body.role) {
  //     throw new BadRequestException(
  //       this.i18nService.t('errors.Http_Errors.CANT_UPDATE_USER_ROLE'),
  //     );
  //   }

  //   if (body.password) {
  //     const hashedPassword = await this.bcryptService.hash(body.password);
  //     body.password = hashedPassword;
  //   }

  //   return await this.repoService.updateOne(TABLES.USERS, { id }, body);
  // }
}
