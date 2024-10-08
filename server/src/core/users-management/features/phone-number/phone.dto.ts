import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CustomReqQueryDTO } from 'src/shared/modules/repository/repository.type';
import { PhoneType } from './phone.type';

export class GetAllPhoneNumbersDTO extends CustomReqQueryDTO {
  @IsOptional()
  id: number;

  @IsOptional()
  @IsEnum(PhoneType)
  type: PhoneType;

  @IsOptional()
  marketing_opt_in: string;
}

export class CreatePhoneNumberDTO {
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  country_code: string;

  @IsEnum(PhoneType)
  @IsOptional()
  type?: PhoneType;

  @IsBoolean()
  @IsOptional()
  marketing_opt_in?: boolean;
}
