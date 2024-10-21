import { IsString, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCurrencyDTO {
  @IsString()
  currency_code: string;

  @IsString()
  currency_name: string;

  @IsNumber()
  exchange_rate: number;
}

export class UpdateCurrencyDTO extends PartialType(CreateCurrencyDTO) {}
