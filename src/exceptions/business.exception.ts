import { HttpStatus } from '@nestjs/common';

export class BusinessException extends Error {
  private readonly status: HttpStatus;

  constructor(message: string, status: HttpStatus) {
    super(message);
    this.status = status;
  }

  getStatus(): HttpStatus {
    return this.status;
  }
}
