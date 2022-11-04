import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    /*if (status === 400) {
      const errorsMessages = [];

      const resp = exception.getResponse();
      
      resp.message.forEach((item) =>
        errorsMessages.push({ message: item.message, field: item.field }),
      );
      response.status(status).json({ errorsMessages: errorsMessages });
    }*/
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
