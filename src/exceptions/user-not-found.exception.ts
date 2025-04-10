import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(error?: any) {
    super('User Not Found', error);
  }
}
