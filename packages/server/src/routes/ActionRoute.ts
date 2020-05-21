import Router from 'express-promise-router'
import { ApiPaths, ActionPathParams } from '@sheeted/core/build/web/Paths'

import { RouterParams } from '../types/Router.type'

export const ActionRoute = ({ jwt }: RouterParams) =>
  Router().post<ActionPathParams>(
    ApiPaths.ACTION_ONE,
    jwt.guard,
    async (req, res) => {
      res.json({ ok: true })
    },
  )
