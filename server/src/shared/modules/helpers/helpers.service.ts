import { Injectable } from '@nestjs/common';

@Injectable()
export class HelpersService {
  constructor() {}

  test() {
    console.log('TEST');
  }
}
