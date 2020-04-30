import { Repositories, Sheet, SheetGroup } from '@sheeted/core'
import { PassportStatic } from 'passport'
import { Router } from 'express'

import { JWT } from '../JWT'

import { ApplicationConfig } from './ApplicationConfig.type'

export type RouterParams = {
  sheets: Sheet[]
  groups: SheetGroup[]
  config: ApplicationConfig
  passport: PassportStatic
  jwt: JWT
  repositories: Repositories
}

export type RouterBuilder = (params: RouterParams) => Router
