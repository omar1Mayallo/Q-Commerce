import { Injectable } from '@nestjs/common';
import { RepositoryService } from 'src/shared/modules/repository/repository.service';
import { AddressModel } from '../address.type';

@Injectable()
export class AddressService {
  constructor(private readonly repoService: RepositoryService<AddressModel>) {}
}
