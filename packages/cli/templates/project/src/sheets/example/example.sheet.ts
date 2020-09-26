import { Sheet } from '@sheeted/core'

import { Role, SheetNames } from '../../constants'

import { ExampleEntity } from './example.entity'
import { ExampleSchema } from './example.schema'
import { ExampleValidator } from './example.validator'
import { ExampleView } from './example.view'
import { ExampleAccessPolicies } from './example.access-policies'
import { ExampleActions } from './example.actions'
import { ExampleHook } from './example.hook'

export const ExampleSheet: Sheet<ExampleEntity, Role> = {
  name: SheetNames.Example,
  Schema: ExampleSchema,
  Validator: ExampleValidator,
  View: ExampleView,
  AccessPolicies: ExampleAccessPolicies,
  Actions: ExampleActions,
  Hook: ExampleHook,
}
