import Router from 'express-promise-router'
import { ApiPaths } from '@sheeted/core/build/web/Paths'
import { Request, Response } from 'express'

import { JWT } from '../JWT'
import { IAMUserModel } from '../sheets/IAMUserSheet/IAMUserModel'

export const currentUserRoute = (jwt: JWT) =>
  Router().get(
    ApiPaths.CURRENT_USER,
    jwt.guard,
    async (req: Request, res: Response) => {
      const userId = req.context!.user.id
      const user = await IAMUserModel.findOne({ id: userId })
      res.json({ user })
    },
  )
