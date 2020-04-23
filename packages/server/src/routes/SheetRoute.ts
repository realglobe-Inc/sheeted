import Router from 'express-promise-router'
import { ApiPaths, SheetPathParams } from '@sheeted/core/build/web/Paths'
import { Sheets } from '@sheeted/core/build/web/Shared.type'

import { EntityController } from '../controllers/EntityController'
import { RouterParams } from '../types/Router.type'

export const SheetRoute = ({ sheets, groups, jwt }: RouterParams) => {
  return (
    Router()
      // one
      .get<SheetPathParams>(ApiPaths.SHEET_ONE, jwt.guard, async (req, res) => {
        const controller = EntityController.from(req, sheets)
        const info = await controller.info()
        res.json(info)
      })
      // list
      .get(ApiPaths.SHEETS, jwt.guard, async (req, res) => {
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
