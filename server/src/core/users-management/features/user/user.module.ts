import { Global, Module } from '@nestjs/common';
import { BcryptModule } from '../../common/modules/bcrypt/bcrypt.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Global()
@Module({
  imports: [BcryptModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
