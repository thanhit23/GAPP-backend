import { NotFoundException } from '@nestjs/common';

export class NewsFeedNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('News Feed Not Found', error);
  }
}
