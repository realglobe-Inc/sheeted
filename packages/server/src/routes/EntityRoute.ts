import Router from 'express-promise-router'
import { Request, Response, Router as IRouter } from 'express'
import {
  ApiPaths,
  SheetPathParams,
  EntityPathParams,
} from '@sheeted/core/build/web/Paths'
import bodyParser from 'body-parser'

import { EntityController } from '../controllers/EntityController'
import { parseListQuery } from '../middlewares/QueryMiddleware'
import { RouterParams } from '../types/Router.type'
import { assertContext } from '../utils/assertionUtil'
import { GuardMiddleware } from '../middlewares/GuardMiddleware'

export const EntityRoute = ({
  sheets,
  guards,
  repositories,
}: RouterParams): IRouter => {
  return (
    Router()
      // list
      .get<SheetPathParams>(
        ApiPaths.ENTITIES,
        GuardMiddleware(guards),
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
          const { page = 1, limit = 20, search = '', sort = [], filter = {} } =
            req.listQuery || {} // parseListQuery により作られた値
          const list = await controller.list({
            page,
            limit,
            search,
            sort,
            filter,
          })
          res.json(list)
        },
      )
      // one
      .get<EntityPathParams>(
        ApiPaths.ENTITY_ONE,
        GuardMiddleware(guards),
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
        GuardMiddleware(guards),
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
        GuardMiddleware(guards),
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
        GuardMiddleware(guards),
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
