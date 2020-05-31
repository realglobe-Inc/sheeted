import { Request, Response, NextFunction } from 'express'
import { InputValidationErrors } from '@sheeted/core/build/web/Shared.type'
import { HttpStatuses } from '@sheeted/core/build/web/Consts'
import { HttpError } from '@sheeted/core/build/web/Errors'

export class HttpValidationError extends Error
  implements InputValidationErrors {
  status = HttpStatuses.UNPROCESSABLE_ENTITY
  constructor(public errors: { message: string; field: string }[]) {
    super()
  }
}

export const handleError = (
  err: any,
  req: Request,
  res: Response,
  // NOTE: Correct express error handler has 4 arguments.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      error: {
        message: err.message,
      },
    })
  } else if (err instanceof HttpValidationError) {
    const error: InputValidationErrors = {
      errors: err.errors.map((e) => ({
        message: e.message,
        field: e.field,
      })),
    }
    res.status(err.status).json(error)
  } else {
    const message: string = err.message || ''
    res.status(HttpStatuses.INTERNAL_SERVER_ERROR).json({
      error: {
        message: `Internal Server Error: ${message}`,
      },
    })
  }
}
