import { Request, Response, NextFunction } from 'express'

import { Guard } from '../guards/Guard.type'

export const GuardMiddleware = (guards: Guard[]) => async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  for (const guard of guards) {
    const token = guard.getSecretFromReq(req)
    if (!token) {
      continue
    }
    const user = await guard.verify(token)
    if (!user) {
      continue
    }
    req.context = { user }
    next()
    return
  }
  res.status(401)
  res.json({
    error: 'Unauthorized',
  })
}
