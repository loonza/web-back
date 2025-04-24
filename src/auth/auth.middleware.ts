import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import Session from 'supertokens-node/recipe/session';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = await Session.getSession(req, res);

      (req as any).session = session;
      console.log('privet');
      next();
    } catch {
      res.status(401).json({ message: 'Unauthorized' });
    }
  }
}
