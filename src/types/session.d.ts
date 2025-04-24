import type { SessionContainerInterface } from 'supertokens-node/recipe/session';
import { user_role_enum } from '@prisma/client';
import 'express';
import 'express-session';

declare module 'express' {
  interface Request {
    session?: SessionContainerInterface;
  }
}

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string;
      username: string;
      email?: string;
      password: string;
      role: user_role_enum;
    };
  }
}
export { user_role_enum };
