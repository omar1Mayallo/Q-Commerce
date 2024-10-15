import { IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCountryDTO {
  @IsString()
  country_code: string;

  @IsString()
  country_name: string;
}

export class UpdateCountryDTO extends PartialType(CreateCountryDTO) {}
