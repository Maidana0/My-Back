import { Catch, ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    
    // CUSTOM
    let error = status == 500 ? false
      : exception.response.error || false;
      
    let message = status == 500 ? false
      : exception.response.message || exception.message
    if(!message) message = exception._message || false

    const returnMessage = () => {
      if (exception instanceof HttpException) return ((message && error) && (message != error)) ? { message, error } : { message };
      else return { message: message || 'Internal Server Error' };
    }

    // console.log(exception);
    
    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        ...returnMessage()
      });

  }
}



//

// const returnMessage = () => {
//   if (message && error) return {
//     message: exception instanceof HttpException ? message : 'Internal Server Error',
//     error: exception instanceof HttpException ? error : 'Internal Server Error',
//   }
//   return {
//     message: exception instanceof HttpException ? message : 'Internal Server Error',
//   }
// }

// message: exception instanceof HttpException ? message : 'Internal Server Error',
// error: exception instanceof HttpException ? error : 'Internal Server Error';
// .json({
//   statusCode: status,
//   timestamp: new Date().toISOString(),
//   path: request.url,
//   message: exception instanceof HttpException ? message :  'Internal Server Error',
// });