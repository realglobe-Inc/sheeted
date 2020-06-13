import Router from 'express-promise-router'
import { ApiPaths } from '@sheeted/core/build/web/Paths'
import { Request, Response, Router as IRouter } from 'express'
import { IAM_USER_SHEET, IAMUserEntity } from '@sheeted/core'

import { RouterParams } from '../types/Router.type'
import { GuardMiddleware } from '../middlewares/GuardMiddleware'

export const CurrentUserRoute = ({
  guards,
  repositories,
}: RouterParams): IRouter =>
  Router().get(
    ApiPaths.CURRENT_USER,
    GuardMiddleware(guards),
    async (req: Request, res: Response) => {
      const userId = req.context!.user.id
      const IAMUserSheet = repositories.get<IAMUserEntity>(IAM_USER_SHEET)
      const user = await IAMUserSheet.findOne({ id: userId })
      res.json({ user })
    },
  )
