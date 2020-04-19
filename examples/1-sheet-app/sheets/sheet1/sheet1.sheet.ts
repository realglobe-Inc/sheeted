import { Sheet } from '@sheeted/core'

import { SheetNames, Role } from '../../constants'

import { Sheet1Entity } from './sheet1.entity'
import { Sheet1Schema } from './sheet1.schema'
import { Sheet1View } from './sheet1.view'
import { Sheet1AccessPolicies } from './sheet1.access-policies'
import { Sheet1Validator } from './sheet1.validator'
import { Sheet1Hook } from './sheet1.hook'
import { Sheet1Model } from './sheet1.model'

export const Sheet1Sheet: Sheet<Sheet1Entity, Role> = {
  name: SheetNames.SHEET1,
  Schema: Sheet1Schema,
  Model: Sheet1Model,
  Validator: Sheet1Validator,
  View: Sheet1View,
  AccessPolicies: Sheet1AccessPolicies,
  Hook: Sheet1Hook,
}
