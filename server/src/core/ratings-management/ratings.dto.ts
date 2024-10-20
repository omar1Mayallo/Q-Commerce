import { PartialType } from '@nestjs/mapped-types';
import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';

export class CreateReviewDTO {
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  review_text?: string;

  @IsBoolean()
  @IsOptional()
  verified_purchase?: boolean;
}

export class UpdateReviewDTO extends PartialType(CreateReviewDTO) {}

export class CreateReplyDTO {
  @IsOptional()
  @IsNumber()
  parent_reply_id?: number;

  @IsString()
  reply_text: string;
}

export class UpdateReplyDTO extends PartialType(CreateReplyDTO) {}
