import { Request, Response, NextFunction } from 'express'
import { ErrorResponse, InputError } from '@sheeted/core/build/web/Shared.type'
import { HttpStatuses } from '@sheeted/core/build/web/Consts'
import { HttpError } from '@sheeted/core/build/web/Errors'

export class HttpValidationError extends Error {
  status = HttpStatuses.UNPROCESSABLE_ENTITY
  constructor(public errors: InputError[]) {
    super()
  }
}

export const handleError = (
  err: Error,
  _req: Request,
  res: Response,
  // NOTE: Correct express error handler has 4 arguments.
  _next: NextFunction,
): void => {
  if (err instanceof HttpError) {
    const resp: ErrorResponse = {
      error: {
        message: err.message,
      },
    }
    res.status(err.status).json(resp)
  } else if (err instanceof HttpValidationError) {
    const error: ErrorResponse = {
      error: {
        message: 'Validation Error',
        inputErrors: err.errors,
      },
    }
    res.status(err.status).json(error)
  } else {
    console.error(err)
    const message: string = err.message || ''
    res.status(HttpStatuses.INTERNAL_SERVER_ERROR).json({
      error: {
        message: `Internal Server Error: ${message}`,
      },
    })
  }
}
