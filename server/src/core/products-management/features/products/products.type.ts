import { BaseModel } from 'src/shared/types/base-model.types';

export class ProductModel extends BaseModel {
  category_id: string;
  product_name: string;
  product_description?: string;
  base_price: string;
  base_quantity: string;
  base_tax_rate?: string;
  base_tax_amount?: string;
  base_discount_price?: string;
  base_discount_percentage?: string;
}
