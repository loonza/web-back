import { Request, Response, NextFunction } from 'express';

export function ElapsedTimeMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const start = Date.now();

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const originalRender = res.render;

  res.render = function (view: string, options?: any, callback?: any) {
    const elapsed = `${Date.now() - start}ms`;
    res.locals.elapsedTime = elapsed;

    if (typeof options === 'object') {
      options.elapsedTime = elapsed;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return originalRender.call(this, view, options, callback);
  };

  next();
}
