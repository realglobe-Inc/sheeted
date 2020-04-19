import { compileModel } from '@sheeted/core'

import { SheetNames } from '../../constants'

import { Sheet1Schema } from './sheet1.schema'
import { Sheet1Entity } from './sheet1.entity'

export const Sheet1Model = compileModel<Sheet1Entity>(
  SheetNames.SHEET1,
  Sheet1Schema,
)
