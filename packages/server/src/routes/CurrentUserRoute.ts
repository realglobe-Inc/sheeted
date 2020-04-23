import Router from 'express-promise-router'
import { ApiPaths } from '@sheeted/core/build/web/Paths'
import { Request, Response } from 'express'
import { IAM_USER_SHEET, IAMUserEntity } from '@sheeted/core'

import { RouterParams } from '../types/Router.type'

export const CurrentUserRoute = ({ jwt, repositories }: RouterParams) =>
  Router().get(
    ApiPaths.CURRENT_USER,
    jwt.guard,
    async (req: Request, res: Response) => {
      const userId = req.context!.user.id
      const IAMUserSheet = repositories.get<IAMUserEntity>(IAM_USER_SHEET)
      const user = await IAMUserSheet.findOne({ id: userId })
      res.json({ user })
    },
  )
