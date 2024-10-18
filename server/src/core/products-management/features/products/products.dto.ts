import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreateProductDTO {
  @IsNumber()
  @IsOptional()
  category_id?: number;

  @IsString()
  product_name: string;

  @IsString()
  @IsOptional()
  product_description?: string;

  @IsNumber()
  base_price: number;

  @IsNumber()
  base_quantity: number;

  @IsNumber()
  @IsOptional()
  base_tax_rate?: number;

  @IsNumber()
  @IsOptional()
  base_tax_amount?: number;

  @IsNumber()
  @IsOptional()
  base_discount_price?: number;

  @IsNumber()
  @IsOptional()
  base_discount_percentage?: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDTO)
  variants?: ProductVariantDTO[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RegionalDataDTO)
  regionalData?: RegionalDataDTO[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDTO)
  images?: ProductImageDTO[];
}

export class ProductVariantDTO {
  @IsString()
  sku: string;

  @IsString()
  unique_variant_name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantAttributeDTO)
  variant_attributes: ProductVariantAttributeDTO[];
}

export class ProductVariantAttributeDTO {
  @IsNumber()
  attribute_id: number;

  @IsNumber()
  attribute_option_id: number;
}

export class RegionalDataDTO {
  @IsString()
  sku: string; // SKU used to link regional data to a variant

  @IsString()
  country_code: string;

  @IsString()
  currency_code: string;

  @IsNumber()
  price: number;

  @IsNumber()
  tax_rate: number;

  @IsNumber()
  tax_amount: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  @IsOptional()
  discount_price?: number;

  @IsNumber()
  @IsOptional()
  discount_percentage?: number;
}

export class ProductImageDTO {
  @IsString()
  img_url: string;

  @IsString()
  @IsOptional()
  img_type?: string;

  @IsNumber()
  @IsOptional()
  img_order?: number;
}

export class UpdateProductDTO extends PartialType(CreateProductDTO) {}
