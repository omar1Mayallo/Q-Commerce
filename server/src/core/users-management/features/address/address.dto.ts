import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CustomReqQueryDTO } from 'src/shared/modules/repository/repository.type';

export class CreateAddressDTO {
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  postal_code: string;
}

export class UpdateAddressDTO extends PartialType(CreateAddressDTO) {}

export class GetAllAddressesDTO extends CustomReqQueryDTO {
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;
}
