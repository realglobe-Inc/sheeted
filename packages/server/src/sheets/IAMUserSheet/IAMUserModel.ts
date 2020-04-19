import { IAMUserEntity, IAM_USER_SHEET, compileModel } from '@sheeted/core'

import { buildIAMUserSchema } from './IAMUserSchema'

const schema = buildIAMUserSchema<string>([])

export const IAMUserModel = compileModel<IAMUserEntity>(IAM_USER_SHEET, schema)
