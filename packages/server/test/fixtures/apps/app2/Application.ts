import {
  Sheet,
  Types,
  DefaultIAMRoles,
  ValidationResult,
  EntityBase,
  Application,
  DefaultIAMRole,
  Schema,
  IAMUserEntity,
  IAM_USER_SHEET,
} from '@sheeted/core'
import { Express } from 'express'
import { MongoDriver, compileModel } from '@sheeted/mongoose'

import { createApp, ApplicationConfig } from '../../../../src'

export interface App2Entity extends EntityBase {
  name: string
  user: IAMUserEntity
}

const App2Schema: Schema<App2Entity> = {
  name: {
    type: Types.Text,
  },
  user: {
    type: Types.Entity,
    entityProperties: {
      sheetName: IAM_USER_SHEET,
    },
  },
}

export const app2Model = compileModel('App2', App2Schema)
export const app2Repository = new MongoDriver('App2', App2Schema)

export const App2Sheet: Sheet<App2Entity, DefaultIAMRole> = {
  name: 'App2',
  Schema: App2Schema,
  Validator: (_ctx) => (_input: Partial<App2Entity>): ValidationResult => {
    const result = new ValidationResult()
    return result
  },
  View: {
    title: '',
    display: (): string => '',
    columns: [],
  },
  AccessPolicies: [],
  Actions: [],
  Hook: {},
}

const config: ApplicationConfig = {
  jwt: {
    secret: 'xxxxxxxxxxxxxxx',
    expiresIn: '5m',
  },
  saml: {},
}

export function App(): Express {
  const application: Application<DefaultIAMRole> = {
    AppTitle: 'App',
    Sheets: [App2Sheet],
    Roles: [
      { label: DefaultIAMRoles.ADMIN_ROLE, value: DefaultIAMRoles.ADMIN_ROLE },
      {
        label: DefaultIAMRoles.DEFAULT_ROLE,
        value: DefaultIAMRoles.DEFAULT_ROLE,
      },
    ],
    DatabaseDriver: MongoDriver,
  }
  const app = createApp(application, config)
  return app
}
