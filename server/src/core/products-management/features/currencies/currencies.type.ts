import { BaseModel } from '../../../../shared/types/base-model.types';

export class CurrencyModel extends BaseModel {
  currency_code: string;
  currency_name: string;
  exchange_rate: number;
}
