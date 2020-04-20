import { Schema, model, Document } from 'mongoose'
import {
  Sheet,
  Types,
  DefaultIAMRoles,
  ValidationResult,
  EntityBase,
} from '@sheeted/core'

import { createApp, ApplicationConfig } from '../../../../src'

export interface App1Entity extends EntityBase {
  n: number
}

const schema = new Schema({
  n: Number,
})

export const App1Model = model<App1Entity & Document>('App1', schema)

export const App1Sheet: Sheet<App1Entity> = {
  name: 'App1',
  Schema: {
    n: {
      type: Types.Numeric,
    },
  },
  Model: App1Model,
  Validator: (_ctx) => (_input) => {
    const result = new ValidationResult()
    return result
  },
  View: {
    title: '',
    display: () => '',
    columns: {},
  },
  AccessPolicies: [],
}

const config: ApplicationConfig = {
  jwt: {
    secret: 'xxxxxxxxxxxxxxx',
    expiresIn: '5m',
  },
  saml: {},
}

export function Application() {
  const application = {
    Sheets: [],
    Roles: [
      { label: DefaultIAMRoles.ADMIN_ROLE, value: DefaultIAMRoles.ADMIN_ROLE },
      {
        label: DefaultIAMRoles.DEFAULT_ROLE,
        value: DefaultIAMRoles.DEFAULT_ROLE,
      },
    ],
  }
  const app = createApp(application, config)
  return app
}
