import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginDTO, RegisterDTO } from './auth.dto';
import { BcryptService } from '../../common/modules/bcrypt/bcrypt.service';
import { JwtService } from '../../common/modules/jwt/jwt.service';
import { RepositoryService } from 'src/shared/modules/repository/repository.service';
import { UserModel } from '../user/user.type';
import { I18nCustomService } from 'src/shared/modules/i18n/i18n.service';
import { TABLES } from 'src/shared/constants/tables.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly repoService: RepositoryService<UserModel>,
    private readonly i18nService: I18nCustomService,
  ) {}

  async register(body: RegisterDTO) {
    // 1) Check if the email already exists
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

    // 2) Hash the password
    const hashedPassword = await this.bcryptService.hash(body.password);

    // 3) Create user
    const newUser = { ...body, password: hashedPassword };
    const createdUser = await this.repoService.createOne(TABLES.USERS, newUser);

    // 4) Generate token
    const token = await this.generateToken(`${createdUser.id}`);

    delete createdUser.password;

    return { user: createdUser, token };
  }

  async login(body: LoginDTO) {
    // 1) Check if user exists and password is correct
    const user = await this.repoService.getOne(
      TABLES.USERS,
      {
        email: body.email,
      },
      { withNotFoundError: false },
    );
    if (
      !user ||
      !(await this.bcryptService.compare(body.password, user.password))
    ) {
      throw new BadRequestException(
        this.i18nService.t('errors.Http_Errors.INVALID_CREDENTIALS'),
      );
    }

    // 2) Generate token
    const token = await this.generateToken(`${user.id}`);

    delete user.password;

    return { user, token };
  }

  //_________________|PRIVATE|_________________//
  private async generateToken(id: string): Promise<string> {
    return this.jwtService.signToken(
      { id },
      this.configService.get<string>('JWT_SECRET'),
      this.configService.get<string>('JWT_EXPIRATION_DATE'),
    );
  }
}
