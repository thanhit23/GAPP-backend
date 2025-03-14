import { NotFoundException } from '@nestjs/common';

export class FollowNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.followNotFound', error);
  }
}
