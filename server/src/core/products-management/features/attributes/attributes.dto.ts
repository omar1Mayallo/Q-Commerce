import { IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateAttributeDTO {
  @IsString()
  attribute_name: string;
}

export class UpdateAttributeDTO extends PartialType(CreateAttributeDTO) {}

export class CreateAttributeOptionDTO {
  @IsString()
  option_name: string;
}
