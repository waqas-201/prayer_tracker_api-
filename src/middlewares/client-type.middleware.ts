// src/common/middleware/client-type.middleware.ts
import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ClientTypeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const clientType = req.headers['x-client-type'];

    if (!clientType) {
      throw new HttpException(
        'Client type not specified',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (clientType !== 'web' && clientType !== 'mobile') {
      throw new HttpException(
        'Unsupported client type',
        HttpStatus.BAD_REQUEST,
      );
    }

    // If valid, proceed to the next middleware or route handler
    next();
  }
}
