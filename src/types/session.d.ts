import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user?: { name: string; authorized: boolean };
  }
}

declare module 'express' {
  interface Request {
    session: SessionData;
  }
}
