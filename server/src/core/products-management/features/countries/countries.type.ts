import { BaseModel } from '../../../../shared/types/base-model.types';

export class CountryModel extends BaseModel {
  country_code: string;
  country_name: string;
}
