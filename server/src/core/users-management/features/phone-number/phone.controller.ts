import { Controller, Get } from '@nestjs/common';

@Controller('phone-numbers')
export class PhoneNumberController {
  constructor() {}

  @Get()
  async getAllPhoneNumbers() {
    return ['022', '022', '022'];
  }
}
