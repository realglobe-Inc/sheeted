import Router from 'express-promise-router'
import { Request, Response, Router as IRouter } from 'express'
import { ApiPaths, ActionPathParams } from '@sheeted/core/build/web/Paths'
import bodyParser from 'body-parser'

import { RouterParams } from '../types/Router.type'
import { assertContext } from '../utils/assertionUtil'
import { EntityController } from '../controllers/EntityController'
import { GuardMiddleware } from '../middlewares/GuardMiddleware'

export const ActionRoute = ({
  guards,
  sheets,
  repositories,
}: RouterParams): IRouter =>
  Router().post<ActionPathParams>(
    ApiPaths.ACTION_ONE,
    GuardMiddleware(guards),
    bodyParser.json(),
    async (req: Request<ActionPathParams>, res: Response) => {
      const { body = {} } = req
      const { ids } = body
      const {
        context,
        params: { sheetName, actionId },
      } = req
      assertContext(context)
      const controller = EntityController.from(
        sheetName,
        context,
        sheets,
        repositories,
      )
      const result = await controller.performAction(actionId, ids)
      res.json(result)
    },
  )
