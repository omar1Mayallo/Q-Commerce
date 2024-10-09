import { IsOptional, IsString, IsInt } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCategoryDTO {
  @IsString()
  category_name: string;

  @IsOptional()
  @IsInt()
  parent_category_id?: number;

  @IsOptional()
  @IsString()
  category_description?: string;

  @IsOptional()
  @IsString()
  category_img?: string;
}

export class UpdateCategoryDTO extends PartialType(CreateCategoryDTO) {}
