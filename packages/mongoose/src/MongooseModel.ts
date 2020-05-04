import {
  Document,
  Types as MongoTypes,
  Schema as MongoSchema,
  model,
  Model as MongoModel,
  modelNames,
} from 'mongoose'
import { v4 as uuid } from 'uuid'
import { Schema, SchemaField } from '@sheeted/core'

/**
 * A helper function to compile a [Mongoose Model](https://mongoosejs.com/docs/api/model.html) from a Sheeted schema object.
 * @param name  The model name. Usually use the sheet name.
 * @param schema  the sheeted schema.
 */
export const compileModel = <Entity>(
  name: string,
  schema: Schema<Entity>,
): MongoModel<Document & Entity> => {
  const exists = modelNames().includes(name)
  if (exists) {
    return model<Document & Entity>(name)
  }
  const definition = Object.fromEntries(
    Object.entries<SchemaField<Entity>>(schema).map(([field, { type }]) => {
      const definitionValue: any = (() => {
        switch (type.rawType) {
          case 'text':
            return String
          case 'number':
            return Number
          case 'text_list':
            return [String]
          case 'entity':
            return {
              type: MongoTypes.ObjectId,
              ref:
                schema[field as Exclude<keyof Entity, 'id'>].entityProperties
                  ?.sheetName,
              autopopulate: true,
            }
        }
      })()
      return [field, definitionValue]
    }),
  )
  const mongoSchema = new MongoSchema({
    ...definition,
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: () => uuid(),
    },
  })
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  mongoSchema.plugin(require('mongoose-autopopulate'))
  return model<Document & Entity>(name, mongoSchema)
}
