import { Module } from '@nestjs/common';
import { JwtModule } from '../../common/modules/jwt/jwt.module';
import { BcryptModule } from '../../common/modules/bcrypt/bcrypt.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule, JwtModule, BcryptModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
