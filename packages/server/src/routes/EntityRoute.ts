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

export const EntityRoute = ({ sheets, jwt }: RouterParams) => {
  return (
    Router()
      // list
      .get<SheetPathParams>(
        ApiPaths.ENTITIES,
        jwt.guard,
        parseListQuery,
        async (req: Request<SheetPathParams>, res: Response) => {
          const controller = EntityController.from(req, sheets)
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
        async (req, res) => {
          const { entityId } = req.params
          const controller = EntityController.from(req, sheets)
          const entity = await controller.one(entityId)
          res.json(entity)
        },
      )
      // create
      .post<SheetPathParams>(
        ApiPaths.ENTITIES,
        jwt.guard,
        bodyParser.json(),
        async (req, res) => {
          const controller = EntityController.from(req, sheets)
          const entity = await controller.create(req.body)
          res.json(entity)
        },
      )
      // update
      .post<EntityPathParams>(
        ApiPaths.ENTITY_ONE,
        jwt.guard,
        bodyParser.json(),
        async (req, res) => {
          const controller = EntityController.from(req, sheets)
          const { entityId } = req.params
          const entity = await controller.update(entityId, req.body)
          res.json(entity)
        },
      )
      // delete
      .delete<EntityPathParams>(
        ApiPaths.ENTITY_ONE,
        jwt.guard,
        async (req, res) => {
          const controller = EntityController.from(req, sheets)
          const { entityId } = req.params
          await controller.delete(entityId)
          res.json({ ok: true })
        },
      )
  )
}
