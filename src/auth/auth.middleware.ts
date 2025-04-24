import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { getSession } from 'supertokens-node/recipe/session/framework/express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
      const session = await getSession(req, res);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      (req as any).session = session;
      console.log('privet');
      next();
    } catch {
      res.status(401).json({ message: 'Unauthorized' });
    }
  }
}
