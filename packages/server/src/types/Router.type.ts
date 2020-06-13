import { Repositories, Sheet, SheetGroup } from '@sheeted/core'
import { PassportStatic } from 'passport'
import { Router } from 'express'

import { JWT } from '../JWT'
import { Guard } from '../guards/Guard.type'

import { ApplicationConfig } from './ApplicationConfig.type'

export type RouterParams = {
  appTitle: string
  sheets: Sheet[]
  groups: SheetGroup[]
  config: ApplicationConfig
  passport: PassportStatic
  jwt: JWT
  guards: Guard[]
  repositories: Repositories
}

export type RouterBuilder = (params: RouterParams) => Router
