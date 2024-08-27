import { Module } from '@nestjs/common';
import { PhoneNumberController } from './phone.controller';
import { PhoneNumbersService } from './phone.service';

@Module({
  controllers: [PhoneNumberController],
  providers: [PhoneNumbersService],
})
export class PhoneNumberModule {}
