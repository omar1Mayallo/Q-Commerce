import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginDTO) {
    return await this.authService.login(body);
  }

  @Post('register')
  async register(@Body() body: RegisterDTO) {
    return await this.authService.register(body);
  }
}
