import { Schema, Validate, Repository } from '@sheeted/core'

import { HttpValidationError } from '../../middlewares/ErrorMiddleware'

import { EntityConverter } from './EntityConverter'

export class EntityValidator {
  constructor(
    private readonly schema: Schema,
    private readonly validateEntity: Validate,
    private readonly repository: Repository<any>,
    private readonly converter: EntityConverter,
  ) {}

  async validate(
    changes: Record<string, any>,
    currentEntity: Record<string, any> | null,
  ): Promise<void> {
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
      if (!schemaValue.optional) {
        if (
          // null をセット
          value === null ||
          // 単純に値がない
          (value === undefined && currentEntity?.[field] == null)
        ) {
          result.appendError({
            field,
            message: 'Required field',
          })
          continue
        }
      }
      if (value == null) {
        continue
      }
      if (schemaValue.unique && value != null) {
        // DBレベルで unique バリデーションをしたほうがパフォーマンスが高いがここで行ったほうがコードがきれいなので
        const val =
          schemaValue.type.rawType === 'entity'
            ? this.converter.beforeSave(value)
            : value
        const exists = await this.repository.findOne({ [field]: val })
        if (exists) {
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
