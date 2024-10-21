import { BaseModel } from '../../../../shared/types/base-model.types';

export class AddressModel extends BaseModel {
  street: string;
  city: string;
  country: string;
  postal_code: string;
  user_id: number;
}
