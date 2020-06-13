import { Request, Response, Router as IRouter } from 'express'
import Router from 'express-promise-router'
import { ApiPaths, SheetPathParams } from '@sheeted/core/build/web/Paths'
import { Sheets } from '@sheeted/core/build/web/Shared.type'

import { EntityController } from '../controllers/EntityController'
import { RouterParams } from '../types/Router.type'
import { assertContext } from '../utils/assertionUtil'
import { GuardMiddleware } from '../middlewares/GuardMiddleware'

export const SheetRoute = ({
  sheets,
  groups,
  guards,
  repositories,
}: RouterParams): IRouter => {
  return (
    Router()
      // one
      .get<SheetPathParams>(
        ApiPaths.SHEET_ONE,
        GuardMiddleware(guards),
        (req: Request<SheetPathParams>, res: Response) => {
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
          const info = controller.info()
          res.json(info)
        },
      )
      // list
      .get(ApiPaths.SHEETS, GuardMiddleware(guards), (req, res) => {
        const resp: Sheets = {
          groups,
          sheets: sheets.map(({ name, group, View }) => ({
            sheetName: name,
            title: View.title,
            icon: View.icon,
            group,
          })),
        }
        res.json(resp)
      })
  )
}
