import { Types } from 'mongoose'

import { Interceptor, ParseFailedError } from '../Interceptor.type'

export type ObjectId = Types.ObjectId

export const ObjectIdInterceptor: Interceptor<ObjectId> = {
  parse(text: string) {
    try {
      return Types.ObjectId.createFromHexString(text)
    } catch (err) {
      throw new ParseFailedError(`Failed to parse "${JSON.stringify(text)}"`)
    }
  },
  stringify(objectId: ObjectId) {
    return objectId.toHexString()
  },
}
