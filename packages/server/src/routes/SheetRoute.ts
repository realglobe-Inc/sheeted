import Router from 'express-promise-router'
import { Sheet } from '@sheeted/core'
import { ApiPaths, SheetPathParams } from '@sheeted/core/build/web/Paths'
import { Sheets } from '@sheeted/core/build/web/Shared.type'
import { SheetGroup } from '@sheeted/core/build/SheetGroup.type'

import { EntityController } from '../controllers/EntityController'
import { JWT } from '../JWT'

export const buildSheetRoute = (
  sheets: Sheet[],
  groups: SheetGroup[],
  jwt: JWT,
) => {
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
