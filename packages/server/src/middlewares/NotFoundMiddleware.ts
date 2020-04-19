import { Request, Response } from 'express'

export const handleNotFound = (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
  })
}
