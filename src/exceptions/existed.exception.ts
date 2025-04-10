import { BadRequestException, HttpStatus } from '@nestjs/common';

interface ExistedExceptionError {
  message: string;
  type: string;
}
export class ExistedException extends BadRequestException {
  constructor(error?: ExistedExceptionError) {
    super({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Bad Request',
      error: 'Bad Request',
      type: 'error',
      ...error,
    });
  }
}
