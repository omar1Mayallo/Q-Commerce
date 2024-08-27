import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard';
import { AddressService } from '../services/address.service';

@Controller('addresses')
@UseGuards(AuthGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}
}
