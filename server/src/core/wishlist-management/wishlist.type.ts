import { BaseModel } from 'src/shared/types/base-model.types';

export class WishlistModel extends BaseModel {
  user_id: number;
}

export class WishlistItemModel extends BaseModel {
  wishlist_id: number;
  product_id: number;
}
