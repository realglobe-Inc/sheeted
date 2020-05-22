import { Sheet } from '@sheeted/core'

import { SheetNames, Role } from '../../constants'

import { Sheet1Entity } from './sheet1.entity'
import { Sheet1Schema } from './sheet1.schema'
import { Sheet1View } from './sheet1.view'
import { Sheet1AccessPolicies } from './sheet1.access-policies'
import { SheetActions } from './sheet1.actions'
import { Sheet1Validator } from './sheet1.validator'
import { Sheet1Hook } from './sheet1.hook'

export const Sheet1Sheet: Sheet<Sheet1Entity, Role> = {
  name: SheetNames.SHEET1,
  Schema: Sheet1Schema,
  Validator: Sheet1Validator,
  View: Sheet1View,
  AccessPolicies: Sheet1AccessPolicies,
  Actions: SheetActions,
  Hook: Sheet1Hook,
}
