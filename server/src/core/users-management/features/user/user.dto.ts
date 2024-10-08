import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Matches,
  IsString,
  Length,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import {
  PASSWORD_REGEX,
  USERNAME_REGEX,
} from 'src/shared/constants/regex.constants';
import { UserRolesE } from '../../common/constants';
import { PartialType } from '@nestjs/mapped-types';
import { CustomReqQueryDTO } from 'src/shared/modules/repository/repository.type';

export class CreateUserDTO {
  @IsEmail(
    {},
    {
      message: i18nValidationMessage<I18nTranslations>(
        'errors.Validation_Errors.INVALID_EMAIL',
      ),
    },
  )
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>(
      'errors.Validation_Errors.REQUIRED',
    ),
  })
  email: string;

  @Matches(PASSWORD_REGEX, {
    message: i18nValidationMessage<I18nTranslations>(
      'errors.Validation_Errors.PASSWORD_REGEX',
    ),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>(
      'errors.Validation_Errors.REQUIRED',
    ),
  })
  password: string;

  @Matches(USERNAME_REGEX, {
    message: i18nValidationMessage<I18nTranslations>(
      'errors.Validation_Errors.USERNAME_REGEX',
    ),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>(
      'errors.Validation_Errors.REQUIRED',
    ),
  })
  username: string;

  @IsOptional()
  @IsEnum(UserRolesE, {
    message: i18nValidationMessage<I18nTranslations>(
      'errors.Validation_Errors.INVALID_ROLE',
    ),
  })
  role: UserRolesE;

  @IsOptional()
  avatar: string;
}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}

export class GetAllUsersDTO extends CustomReqQueryDTO {
  @IsOptional()
  id: string;

  @IsOptional()
  role: string;
}

export class UpdateLoggedUserProfileDTO {
  @IsOptional()
  @IsString()
  @Length(3, 50)
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}

export class UpdateLoggedUserPasswordDTO {
  @IsString()
  @Length(6, 50)
  currentPassword: string;

  @IsString()
  @Length(6, 50)
  newPassword: string;
}
