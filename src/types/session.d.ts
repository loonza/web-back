import 'express-session';
import { user_role_enum } from '@prisma/client';

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
