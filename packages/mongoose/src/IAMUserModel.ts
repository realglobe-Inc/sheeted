import { IAM_USER_SHEET } from '@sheeted/core'
import { buildIAMUserSchema } from '@sheeted/core/build/sheets/IAMUserSheet/IAMUserSchema'

import { compileModel } from './MongooseModel'

const schema = buildIAMUserSchema([] as string[])

export const IAMUserModel = compileModel(IAM_USER_SHEET, schema)
