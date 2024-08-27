import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from 'src/database/database.provider';
import { I18nCustomService } from 'src/shared/modules/i18n/i18n.service';
import { RepositoryService } from 'src/shared/modules/repository/repository.service';
import { BcryptService } from '../../common/modules/bcrypt/bcrypt.service';
import { UserModel } from './user.type';
import { TABLES } from 'src/shared/constants/tables.constants';
import {
  UpdateLoggedUserPasswordDTO,
  CreateUserDTO,
  GetAllUsersDTO,
  UpdateUserDTO,
  UpdateLoggedUserProfileDTO,
} from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(KNEX_CONNECTION)
    private readonly knex: Knex,
    private readonly repoService: RepositoryService<UserModel>,
    private readonly bcryptService: BcryptService,
    private readonly i18nService: I18nCustomService,
  ) {}

  async createUser(body: CreateUserDTO) {
    // 1) Check If Email already exists
    const emailExist = await this.repoService.getOne(
      TABLES.USERS,
      {
        email: body.email,
      },
      { withNotFoundError: false },
    );
    if (emailExist) {
      throw new BadRequestException(
        this.i18nService.t('errors.Http_Errors.EMAIL_UNIQUE'),
      );
    }

    // 2) Hash the password before Inserting
    const hashedPassword = await this.bcryptService.hash(body.password);

    return await this.knex.transaction(async (trx) => {
      // 3) Create a new user
      const newUser = { ...body, password: hashedPassword };
      const [createdUser] = await trx<UserModel>(TABLES.USERS)
        .insert(newUser)
        .returning('*');

      return createdUser;
    });
  }

  async updateUser(id: number, body: UpdateUserDTO) {
    // 1) Check if the user exists
    const user = await this.repoService.getOne(TABLES.USERS, { id });

    // 2) If the email is being updated, check for email uniqueness
    if (body.email && body.email !== user.email) {
      const emailExist = await this.repoService.getOne(
        TABLES.USERS,
        { email: body.email },
        { withNotFoundError: false },
      );
      if (emailExist) {
        throw new BadRequestException(
          this.i18nService.t('errors.Http_Errors.EMAIL_UNIQUE'),
        );
      }
    }

    // 3) If the password is being updated, Hash the password
    if (body.password) {
      body.password = await this.bcryptService.hash(body.password);
    }

    // 4) Perform the update
    return await this.repoService.updateOne(TABLES.USERS, { id }, body);
  }

  async getAllUsers(query: GetAllUsersDTO) {
    return await this.repoService.getAll(TABLES.USERS, query);
  }

  async getUser(id: number) {
    const user = await this.repoService.getOne(TABLES.USERS, { id });
    delete user.password;
    return user;
  }

  async deleteUsers(ids: number[]) {
    await this.repoService.deleteByIds(TABLES.USERS, ids);
    return { message: 'success' };
  }

  async updateLoggedUserProfile(id: number, body: UpdateLoggedUserProfileDTO) {
    // 1) Check if the user exists
    const user = await this.repoService.getOne(TABLES.USERS, { id });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // 2) If the email is being updated, check for email uniqueness
    if (body.email && body.email !== user.email) {
      const emailExist = await this.repoService.getOne(
        TABLES.USERS,
        { email: body.email },
        { withNotFoundError: false },
      );
      if (emailExist) {
        throw new BadRequestException(
          this.i18nService.t('errors.Http_Errors.EMAIL_UNIQUE'),
        );
      }
    }

    // 3) Perform the update
    return await this.repoService.updateOne(TABLES.USERS, { id }, body);
  }

  async updateLoggedUserPassword(
    id: number,
    body: UpdateLoggedUserPasswordDTO,
  ) {
    // 1) Check if the user exists
    const user = await this.repoService.getOne(TABLES.USERS, { id });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // 2) Verify the current password
    const isPasswordValid = await this.bcryptService.compare(
      body.currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // 3) Hash the new password
    const hashedNewPassword = await this.bcryptService.hash(body.newPassword);

    // 4) Perform the update
    return await this.repoService.updateOne(
      TABLES.USERS,
      { id },
      { password: hashedNewPassword },
    );
  }
}
