import { BaseModel } from '../../../../shared/types/base-model.types';

export class CategoryModel extends BaseModel {
  id: number;
  parent_category_id?: number;
  category_name: string;
  category_description?: string;
  category_img?: string;
}
