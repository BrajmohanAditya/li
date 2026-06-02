import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {

    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new BadRequestException('Token not provided');
    }

    try {
      const veryfiyToken = await jwt.verify(token, process.env.JWT_SECRET_KEY as string);

      if (!veryfiyToken) {
        throw new BadRequestException('Invalid token');
      }

      req.admins = veryfiyToken;

      next();
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }
  }
}
