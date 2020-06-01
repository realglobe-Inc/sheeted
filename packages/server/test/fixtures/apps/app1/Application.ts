import {
  Sheet,
  Types,
  DefaultIAMRoles,
  ValidationResult,
  EntityBase,
  Application,
  DefaultIAMRole,
  Schema,
} from '@sheeted/core'
import { Express } from 'express'
import { MongoDriver, compileModel } from '@sheeted/mongoose'

import { createApp, ApplicationConfig } from '../../../../src'

export interface App1Entity extends EntityBase {
  n: number
}

const App1Schema: Schema<App1Entity> = {
  n: {
    type: Types.Numeric,
  },
}

export const app1Model = compileModel('App1', App1Schema)
export const app1Repository = new MongoDriver('App1', App1Schema)

export const App1Sheet: Sheet<App1Entity, DefaultIAMRole> = {
  name: 'App1',
  Schema: App1Schema,
  Validator: (_ctx) => (_input: Partial<App1Entity>): ValidationResult => {
    const result = new ValidationResult()
    return result
  },
  View: {
    title: '',
    display: (): string => '',
    columns: {},
  },
  AccessPolicies: [
    {
      role: 'default',
      action: 'custom',
      customActionId: 'set100',
      condition: (entity: App1Entity): boolean => entity.n < 100,
    },
  ],
  Actions: [
    {
      id: 'set100',
      title: 'SET 100',
      perform: async (entities: App1Entity[]): Promise<void> => {
        for (const entity of entities) {
          await app1Model.updateOne({ id: entity.id }, { n: 100 })
        }
      },
    },
  ],
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
    Sheets: [App1Sheet],
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
