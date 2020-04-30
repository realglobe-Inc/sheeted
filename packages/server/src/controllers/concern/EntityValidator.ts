import { Schema, Validate, Repository } from '@sheeted/core'

import { HttpValidationError } from '../../middlewares/ErrorMiddleware'

export class EntityValidator {
  constructor(
    private readonly schema: Schema,
    private readonly validateEntity: Validate,
    private readonly repository: Repository<any>,
  ) {}

  async validate(changes: any, currentEntity: any) {
    const { schema, validateEntity } = this
    const result = await validateEntity(changes, currentEntity)
    for (const field of Object.keys(schema)) {
      const schemaValue = schema[field]
      const value = changes[field]
      if (!schemaValue) {
        // 本来ここはエラー
        continue
      }
      if (schemaValue.readonly) {
        if (value) {
          result.appendError({
            field,
            message: 'Readonly field',
          })
        }
        continue
      }
      if (value == null) {
        if (!schemaValue.optional && currentEntity?.[field] == null) {
          result.appendError({
            field,
            message: 'Required field',
          })
          continue
        } else {
          continue
        }
      }
      if (schemaValue.unique) {
        // DBレベルで unique バリデーションをしたほうがパフォーマンスが高いがここで行ったほうがコードがきれいなので
        const found = await this.repository.findOne({ [field]: value })
        if (found) {
          result.appendError({
            field,
            message: 'Duplicate value',
          })
        }
      }
      if (schemaValue.type.rawType === 'text_list') {
        if (!Array.isArray(value)) {
          result.appendError({
            field,
            message: 'Must be multiple values',
          })
          continue
        }
        if (!value.every((v) => typeof v === 'string')) {
          result.appendError({
            field,
            message: `Array items must be string, but given ${typeof value}`,
          })
          continue
        }
      }
      if (schemaValue.enumProperties) {
        const values: string[] =
          schemaValue.type.rawType === 'text_list'
            ? value
            : [value].filter(Boolean)
        for (const v of values) {
          if (!schemaValue.enumProperties.values.includes(v)) {
            result.appendError({
              field,
              message: `Invalid enum value: "${v}"`,
            })
            continue
          }
        }
      }
    }
    if (!result.isOk) {
      const { errors } = result
      if (process.env.NODE_ENV === 'test') {
        console.log(errors)
      }
      throw new HttpValidationError(errors)
    }
  }
}
