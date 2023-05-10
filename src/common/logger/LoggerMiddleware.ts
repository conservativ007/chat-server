import { Logger, Injectable } from '@nestjs/common';
import { NestMiddleware } from '@nestjs/common/interfaces/middleware/nest-middleware.interface';
import { Response, Request, NextFunction } from 'express';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger(LoggerMiddleware.name);
  constructor(private loggerService: LoggerService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl, params, body } = request;

    const serializedParams = Object.values(params);
    const serializedBody = JSON.stringify(body);

    response.on('finish', () => {
      const { statusCode } = response;

      let message = `method: ${method}, url: ${originalUrl}, code: ${statusCode}, params: ${serializedParams}, body: ${serializedBody}`;

      if (statusCode < 400) {
        this.logger.log(message);
        this.loggerService.writeLog(message);
        return;
      }

      if (statusCode < 500) {
        this.logger.warn(message);
        this.loggerService.writeLog(message, true);
        return;
      }

      this.logger.error(message);
      this.loggerService.writeLog(message, true);
    });

    next();
  }
}
