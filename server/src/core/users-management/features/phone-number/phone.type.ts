import { BaseModel } from 'src/shared/types/base-model.types';

export enum PhoneType {
  SMS = 'SMS',
  WHATSAPP = 'WHATSAPP',
  CALL = 'CALL',
}

export class PhoneNumberModel extends BaseModel {
  user_id: number;
  phone_number: string;
  country_code: string;
  type: PhoneType;
  marketing_opt_in: boolean;
}
