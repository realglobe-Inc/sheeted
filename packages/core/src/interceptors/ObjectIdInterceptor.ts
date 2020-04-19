import { Types } from 'mongoose'

import { Interceptor } from '../Interceptor.type'

export type ObjectId = Types.ObjectId

export const ObjectIdInterceptor: Interceptor<ObjectId> = {
  parse(text: string) {
    return Types.ObjectId.createFromHexString(text)
  },
  stringify(objectId: ObjectId) {
    return objectId.toHexString()
  },
}
