import { NotFoundException } from '@nestjs/common';

export class NewsFeedNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.newsFeedNotFound', error);
  }
}
