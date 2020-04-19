import {
  Document,
  Types as MongoTypes,
  Schema as MongoSchema,
  model,
  PaginateModel as MongoModel,
  modelNames,
} from 'mongoose'

import { Schema, SchemaField } from './Schema.type'

/**
 * Compile mongoose model from Schema.
 * @param name - model name
 * @param schema - schema
 */
export const compileModel = <Entity = {}>(
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
    },
  })
  return model<Document & Entity>(name, mongoSchema)
}
