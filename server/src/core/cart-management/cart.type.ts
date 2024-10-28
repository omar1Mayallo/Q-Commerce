import { BaseModel } from 'src/shared/types/base-model.types';

export class CartModel extends BaseModel {
  user_id: number;
}

export class CartItemModel extends BaseModel {
  cart_id: number;
  product_variant_id: number;
  quantity: number;
}
