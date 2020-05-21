import Router from 'express-promise-router'
import {
  ApiPaths,
  SheetPathParams,
  ActionPathParams,
} from '@sheeted/core/build/web/Paths'
import { ActionInfo } from '@sheeted/core/build/web/Shared.type'

import { RouterParams } from '../types/Router.type'

// TODO
const actions: ActionInfo[] = [
  {
    id: 'approve',
    title: '承認',
  },
  {
    id: 'reject',
    title: '却下',
  },
]

export const ActionRoute = ({ jwt }: RouterParams) =>
  Router()
    .get<SheetPathParams>(ApiPaths.ACTIONS, jwt.guard, async (req, res) => {
      res.json(actions)
    })
    .post<ActionPathParams>(
      ApiPaths.ACTION_ONE,
      jwt.guard,
      async (req, res) => {
        res.json({ ok: true })
      },
    )
