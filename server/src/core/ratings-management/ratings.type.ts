import { BaseModel } from 'src/shared/types/base-model.types';

export class ReviewModel extends BaseModel {
  product_id: number;
  user_id: number;
  rating: number;
  review_text?: string;
  helpful_count?: number;
  verified_purchase: boolean;
  is_edited: boolean;
}

export class ReviewHelpfulModel extends BaseModel {
  user_id: number;
  review_id: number;
  is_helpful: boolean;
}

export class ReplyModel extends BaseModel {
  review_id: number;
  user_id: number;
  parent_reply_id: number;
  reply_text: string;
}
