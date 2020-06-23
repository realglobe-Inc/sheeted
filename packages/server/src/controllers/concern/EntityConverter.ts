import { Schema, Context } from '@sheeted/core'
import { ParseFailedError } from '@sheeted/core/build/Interceptor.type'
import { WithEntityMetaField } from '@sheeted/core/build/web/Shared.type'
import { ENTITY_META_FIELD } from '@sheeted/core/build/web/Consts'

import { DisplayFunctions } from './DisplayFunctions'
import { UserAccessPolicy } from './UserAccessPolicy'

const displayDefault = (entity: { id: string } | null) =>
  entity ? String(entity.id) : ''

export class EntityConverter {
  constructor(
    private sheetName: string,
    private schema: Schema,
    private accessPolicy: UserAccessPolicy,
    private displays: DisplayFunctions,
    private ctx: Context<any>,
  ) {}

  beforeSave(changes: Record<string, any>): Record<string, any> {
    return [changes]
      .map((changes) => this.parseFieldsByInterceptors(changes))
      .map((changes) => this.dropMetaFields(changes))
      .map((changes) => this.dropTimestamps(changes))
      .pop()!
  }

  beforeSend(entity: Record<string, any>): Record<string, any> {
    return [entity]
      .map((entity) => this.withEntityMetaField(entity))
      .map((entity) => this.dropPrivateFields(entity))
      .map((entity) => this.stringifyFieldsByInterceptors(entity))
      .map((entity) => this.dropExcludedColumns(entity))
      .pop()!
  }

  private parseFieldsByInterceptors(entity: Record<string, any>) {
    const copy = { ...entity }
    const { schema } = this
    // partial entity なので entity の filed を見る
    for (const field of Object.keys(entity)) {
      const interceptor = schema[field]?.type.interceptor
      if (interceptor) {
        try {
          copy[field] = interceptor.parse(entity[field])
        } catch (err) {
          if (err instanceof ParseFailedError) {
            console.log(`Failed to parse field "${field}": ${err.message}`)
            delete copy[field]
          } else {
            throw err
          }
        }
      }
    }
    return copy
  }

  private stringifyFieldsByInterceptors(entity: Record<string, any>) {
    const copy = { ...entity }
    const { schema } = this
    for (const field of Object.keys(schema)) {
      if (entity[field] == null) {
        continue
      }
      const interceptor = schema[field]?.type.interceptor
      if (interceptor) {
        copy[field] = interceptor.stringify(entity[field])
      }
    }
    return copy
  }

  private withEntityMetaField(entity: Record<string, any>) {
    const { sheetName, schema, displays } = this
    const copy = { ...entity }
    // Set meta field in sub entities
    for (const field of Object.keys(copy)) {
      const isEntityField = schema[field]?.type.rawType === 'entity'
      if (!isEntityField) {
        continue
      }
      const subEntity = copy[field]
      if (!subEntity) {
        continue
      }
      const sheetName = schema[field].entityProperties?.sheetName ?? ''
      const display = displays[sheetName] || displayDefault
      const withMeta = {
        [ENTITY_META_FIELD]: {
          displayText: display(subEntity),
        },
      }
      Object.assign(subEntity, withMeta)
    }
    // Set meta field in entity
    const display = displays[sheetName] || displayDefault
    const permissions = this.getPermissions(entity)
    const withMeta: WithEntityMetaField = {
      [ENTITY_META_FIELD]: {
        displayText: display(copy),
        permissions,
      },
    }
    Object.assign(copy, withMeta)
    return copy
  }

  private dropMetaFields(entity: Record<string, any>) {
    const copy = { ...entity }
    for (const field of Object.keys(copy)) {
      if (field === ENTITY_META_FIELD) {
        delete copy[field]
      }
    }
    return copy
  }

  private dropTimestamps(entity: Record<string, any>) {
    const copy = { ...entity }
    for (const field of Object.keys(copy)) {
      if (field === 'createdAt' || field === 'updatedAt') {
        delete copy[field]
      }
    }
    return copy
  }

  private dropPrivateFields(entity: Record<string, any>) {
    const copy = { ...entity }
    for (const field of Object.keys(copy)) {
      // __v などを消す。_id は ref のために残す
      if (field !== '_id' && field.startsWith('_')) {
        delete copy[field]
      }
    }
    return copy
  }

  private dropExcludedColumns(entity: Record<string, any>) {
    const { accessPolicy } = this
    const readPolicy = accessPolicy.ofRead
    if (!readPolicy) {
      // Must be blocked before
      throw new Error('Has no permission to read')
    }
    const copy = { ...entity }
    for (const field of Object.keys(entity)) {
      if (readPolicy.deniedColumns.includes(field)) {
        delete copy[field]
      }
    }
    return copy
  }

  private getPermissions(entity: Record<string, any>) {
    const { accessPolicy, ctx } = this
    const updatePolicy = accessPolicy.ofUpdate
    const updates = updatePolicy
      ? updatePolicy.condition
        ? updatePolicy.condition(entity, ctx)
        : true
      : false
    const deletePolicy = accessPolicy.ofDelete
    const deletes = deletePolicy
      ? deletePolicy.condition
        ? deletePolicy.condition(entity, ctx)
        : true
      : false
    const actionPolicies = accessPolicy.ofActions || []
    const customActions: {
      [actionId: string]: boolean
    } = Object.fromEntries(
      actionPolicies.map((policy) => [
        policy.customActionId,
        policy
          ? policy.condition
            ? policy.condition(entity, ctx)
            : true
          : false,
      ]),
    )
    const permissions = {
      updates,
      deletes,
      customActions,
    }
    return permissions
  }
}
