import { HttpStatus } from '@nestjs/common';

export interface ErrorModel {
  message: string;
  succeed: boolean;
  statusCode: HttpStatus;
}