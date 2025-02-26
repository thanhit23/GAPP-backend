import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';

export class ExistedException extends BadRequestException {
  constructor(message?: string) {
    super(
      HttpException.createBody(
        null,
        message!,
        HttpStatus.BAD_REQUEST,
      ),
      message,
    );
  }
}
