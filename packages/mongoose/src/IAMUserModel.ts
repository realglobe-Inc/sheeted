import { IAM_USER_SHEET } from '@sheeted/core'
import { buildIAMUserSchema } from '@sheeted/core/build/sheets/IAMUserSheet/IAMUserSchema'

import { compileModel } from './MongooseModel'

/** @internal */
const iamUserSchema = buildIAMUserSchema([] as string[])

/**
 * A Mongoose Model for IAM user.
 */
export const IAMUserModel = compileModel(IAM_USER_SHEET, iamUserSchema)
