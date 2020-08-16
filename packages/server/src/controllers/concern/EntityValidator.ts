import { Schema, Validate, Repository } from '@sheeted/core'
import { InputError } from '@sheeted/core/build/web/Shared.type'
import { ValidationErrorTypes } from '@sheeted/core/build/web/Consts'

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
    const custom = await validateEntity(changes, currentEntity)
    const errors: InputError[] = custom.errors.map(({ field, message }) => ({
      type: ValidationErrorTypes.CUSTOM,
      field,
      message,
    }))
    for (const field of Object.keys(schema)) {
      const schemaValue = schema[field]
      const value = changes[field]
      if (!schemaValue) {
        // 本来ここはエラー
        continue
      }
      if (schemaValue.readonly) {
        if (value) {
          errors.push({
            type: ValidationErrorTypes.READONLY,
            field,
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
          errors.push({
            type: ValidationErrorTypes.REQUIRED,
            field,
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
          errors.push({
            type: ValidationErrorTypes.DUPLICATE,
            field,
          })
        }
      }
      // TODO: VALUE_TYPE 系のエラーをもっと充実させる
      if (schemaValue.type.rawType === 'text_list') {
        if (!Array.isArray(value)) {
          errors.push({
            type: ValidationErrorTypes.VALUE_TYPE,
            field,
          })
          continue
        }
        if (!value.every((v) => typeof v === 'string')) {
          errors.push({
            type: ValidationErrorTypes.VALUE_TYPE,
            field,
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
            errors.push({
              type: ValidationErrorTypes.ENUM,
              field,
            })
            continue
          }
        }
      }
    }
    if (errors.length > 0) {
      throw new HttpValidationError(errors)
    }
  }
}
