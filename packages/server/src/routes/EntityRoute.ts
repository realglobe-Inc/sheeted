import Router from 'express-promise-router'
import { Request, Response } from 'express'
import {
  ApiPaths,
  SheetPathParams,
  EntityPathParams,
} from '@sheeted/core/build/web/Paths'
import { ListQuery } from '@sheeted/core/build/web/Shared.type'
import bodyParser from 'body-parser'

import { EntityController } from '../controllers/EntityController'
import { parseListQuery } from '../middlewares/QueryMiddleware'
import { RouterParams } from '../types/Router.type'
import { assertContext } from '../utils/assertionUtil'

export const EntityRoute = ({ sheets, jwt, repositories }: RouterParams) => {
  return (
    Router()
      // list
      .get<SheetPathParams>(
        ApiPaths.ENTITIES,
        jwt.guard,
        parseListQuery,
        async (req: Request<SheetPathParams>, res: Response) => {
          const {
            context,
            params: { sheetName },
          } = req
          assertContext(context)
          const controller = EntityController.from(
            sheetName,
            context,
            sheets,
            repositories,
          )
          const { page = 1, limit = 20, search = '', sort = [] } = (req as any)
            .listQuery as ListQuery // parseListQuery により作られた値
          const list = await controller.list({ page, limit, search, sort })
          res.json(list)
        },
      )
      // one
      .get<EntityPathParams>(
        ApiPaths.ENTITY_ONE,
        jwt.guard,
        async (req: Request<EntityPathParams>, res: Response) => {
          const { entityId } = req.params
          const {
            context,
            params: { sheetName },
          } = req
          assertContext(context)
          const controller = EntityController.from(
            sheetName,
            context,
            sheets,
            repositories,
          )
          const entity = await controller.one(entityId)
          res.json(entity)
        },
      )
      // create
      .post<SheetPathParams>(
        ApiPaths.ENTITIES,
        jwt.guard,
        bodyParser.json(),
        async (req: Request<SheetPathParams>, res: Response) => {
          const {
            context,
            params: { sheetName },
          } = req
          assertContext(context)
          const controller = EntityController.from(
            sheetName,
            context,
            sheets,
            repositories,
          )
          const entity = await controller.create(req.body)
          res.json(entity)
        },
      )
      // delete
      .post<SheetPathParams>(
        ApiPaths.ENTITIES_DELETE,
        jwt.guard,
        bodyParser.json(),
        async (req: Request<SheetPathParams>, res: Response) => {
          const { body = {} } = req
          const { ids } = body
          const {
            context,
            params: { sheetName },
          } = req
          assertContext(context)
          const controller = EntityController.from(
            sheetName,
            context,
            sheets,
            repositories,
          )
          await controller.delete(ids)
          res.json({ ok: true })
        },
      )
      // update
      .post<EntityPathParams>(
        ApiPaths.ENTITY_ONE,
        jwt.guard,
        bodyParser.json(),
        async (req: Request<EntityPathParams>, res: Response) => {
          const {
            context,
            params: { sheetName, entityId },
          } = req
          assertContext(context)
          const controller = EntityController.from(
            sheetName,
            context,
            sheets,
            repositories,
          )
          const entity = await controller.update(entityId, req.body)
          res.json(entity)
        },
      )
  )
}
