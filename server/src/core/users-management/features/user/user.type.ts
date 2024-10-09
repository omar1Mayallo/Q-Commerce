import { BaseModel } from '../../../../shared/types/base-model.types';
import { UserRolesE } from '../../common/constants';

export class UserModel extends BaseModel {
  username: string;
  email: string;
  password: string;
  role?: UserRolesE;
  avatar?: any;
}
