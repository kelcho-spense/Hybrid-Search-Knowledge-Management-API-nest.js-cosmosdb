import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { MyLoggerService } from './my-logger/my-logger.service';
import { ErrorResponse, RestError } from '@azure/cosmos';
import { CosmosErrorCode } from './database/cosmosErrorCode';

type MyResponseObj = {
  statusCode: number;
  timestamp: string;
  path: string;
  message?: string;
  response?: string | object;
  error?: {
    code?: number;
    name?: string;
    details?: string;
  };
};

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new MyLoggerService(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const myResponseObj: MyResponseObj = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    if (exception instanceof ErrorResponse) {
      switch (exception.code) {
        case CosmosErrorCode.NOT_FOUND:
          myResponseObj.statusCode = HttpStatus.NOT_FOUND;
          myResponseObj.message = 'Resource not found';
          break;
        case CosmosErrorCode.CONFLICT:
          myResponseObj.statusCode = HttpStatus.CONFLICT;
          myResponseObj.message = 'Resource already exists';
          break;
        case CosmosErrorCode.UNAUTHORIZED:
          myResponseObj.statusCode = HttpStatus.UNAUTHORIZED;
          myResponseObj.message = 'Unauthorized access';
          break;
        case CosmosErrorCode.FORBIDDEN:
          myResponseObj.statusCode = HttpStatus.FORBIDDEN;
          myResponseObj.message = 'Access forbidden';
          break;
        case CosmosErrorCode.TIMEOUT:
          myResponseObj.statusCode = HttpStatus.REQUEST_TIMEOUT;
          myResponseObj.message = 'Operation timed out';
          break;
        case CosmosErrorCode.TOO_MANY_REQUESTS:
          myResponseObj.statusCode = HttpStatus.TOO_MANY_REQUESTS;
          myResponseObj.message = 'Rate limit exceeded';
          break;
        default:
          myResponseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
          myResponseObj.message = 'An unexpected error occurred';
      }
      myResponseObj.error = {
        code: parseInt(String(exception.code), 10),
        name: exception.name,
        details: exception.message,
      };
    } else if (exception instanceof RestError) {
      myResponseObj.statusCode = HttpStatus.SERVICE_UNAVAILABLE;
      myResponseObj.message = 'Database service is unavailable';
      myResponseObj.error = {
        code: 503,
        name: exception.name,
        details: exception.message,
      };
    } else if (exception instanceof HttpException) {
      myResponseObj.statusCode = exception.getStatus();
      myResponseObj.response = exception.getResponse();
    } else if (exception instanceof Error) {
      myResponseObj.response = exception.message;
    } else {
      myResponseObj.response = 'Internal Server Error';
    }

    response.status(myResponseObj.statusCode).json(myResponseObj);

    this.logger.error(
      myResponseObj.message ||
        (typeof myResponseObj.response === 'string'
          ? myResponseObj.response
          : JSON.stringify(myResponseObj.response)),
      AllExceptionsFilter.name,
    );
    super.catch(exception, host);
  }
}
