import { Request, Response, NextFunction } from 'express'
import { ListQuery } from '@sheeted/core/build/web/Shared.type'
import { HttpStatuses } from '@sheeted/core/build/web/Consts'
import { HttpError } from '@sheeted/core/build/web/Errors'

/**
 * Overwrite query by ListQuery type
 */
export const parseListQuery = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { query } = req
  const page = Number(query.page ?? 1)
  const limit = Number(query.limit ?? 20)
  const search = (query.search || '') as string
  const sort = query.sort || []
  const filter = query.filter || {}

  const errors: string[] = []
  if (!Number.isInteger(page)) {
    errors.push(`"page" must be integer, but given ${page}.`)
  }
  if (page <= 0) {
    errors.push(`"page" must be more than 0, but given ${page}`)
  }
  if (!Number.isInteger(limit)) {
    errors.push(`"limit" must be integer, but given ${limit}.`)
  }
  if (limit <= 0) {
    errors.push(`"limit" must be more than 0, but given ${limit}`)
  }
  if (search.length >= 100) {
    errors.push('"search" string length must be less than 100.')
  }
  if (!Array.isArray(sort)) {
    errors.push(
      `"sort" must be array of string, but given ${JSON.stringify(sort)}.`,
    )
  }
  if (typeof filter !== 'object' || Array.isArray(filter)) {
    errors.push(
      `"filter" must be partial object of an entity, but given ${JSON.stringify(
        filter,
      )}`,
    )
  }
  if (errors.length > 0) {
    throw new HttpError(
      'Query string error: ' + errors.join(' '),
      HttpStatuses.BAD_REQUEST,
    )
  }
  const listQuery = {
    page,
    limit,
    search,
    sort,
    filter,
  } as ListQuery
  Object.assign(req, {
    listQuery,
  })
  next()
}
