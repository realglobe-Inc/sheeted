import { Sheet, Context, EntityBase } from '@sheeted/core'
import { Request } from 'express'
import { connection, Document, PaginateModel } from 'mongoose'
import { v4 as uuid } from 'uuid'
import { paginate } from 'mongoose-paginate'
import {
  SheetInfo,
  ListQuery,
  ListResult,
  Column,
} from '@sheeted/core/build/web/Shared.type'
import { HttpStatuses } from '@sheeted/core/build/web/Consts'
import { HttpError } from '@sheeted/core/build/web/Errors'

import { dropUndef } from '../utils/objectUtil'

import {
  getDisplayFunctions,
  DisplayFunctions,
} from './concern/DisplayFunctions'
import { EntityConverter } from './concern/EntityConverter'
import { EntityValidator } from './concern/EntityValidator'
import { UserAccessPolicy } from './concern/UserAccessPolicy'
import { HookTrigger } from './concern/HookTrigger'

export class EntityController {
  /**
   * Factory method from request
   */
  static from(
    req: Request<{
      sheetName: string
    }>,
    sheets: Sheet[],
  ) {
    const ctx = req.context
    if (!ctx) {
      throw new HttpError('No context', HttpStatuses.BAD_REQUEST)
    }
    const { sheetName } = req.params
    const sheet = sheets.find((sheet) => sheet.name === sheetName)
    if (!sheet) {
      throw new HttpError(`Sheet "${name}" not found`, HttpStatuses.BAD_REQUEST)
    }
    const displays: DisplayFunctions = getDisplayFunctions(sheets)
    return new EntityController(sheet, ctx, displays)
  }

  private readonly userRoles: string[]
  private readonly userAccessPolicy: UserAccessPolicy
  private readonly converter: EntityConverter
  private readonly validator: EntityValidator
  private readonly hook: HookTrigger
  private readonly Model: PaginateModel<EntityBase & Document>

  constructor(
    private readonly sheet: Sheet,
    private readonly ctx: Context<string>,
    displays: DisplayFunctions,
  ) {
    const { Schema } = sheet
    this.userRoles = ctx.user.roles
    this.userAccessPolicy = new UserAccessPolicy(
      this.userRoles,
      sheet.AccessPolicies,
    )
    this.converter = new EntityConverter(
      sheet.name,
      Schema,
      this.userAccessPolicy,
      displays,
    )
    this.hook = new HookTrigger(sheet.Hook)
    this.Model = connection.model(sheet.name) as PaginateModel<
      EntityBase & Document
    >
    this.validator = new EntityValidator(
      Schema,
      sheet.Validator(ctx),
      this.Model,
    )
  }

  async info(): Promise<SheetInfo> {
    const { name: sheetName, View, Schema } = this.sheet
    const { userAccessPolicy } = this
    if (!userAccessPolicy.ofRead) {
      throw new HttpError('Permission denied', HttpStatuses.FORBIDDEN)
    }
    const columns: SheetInfo['columns'] = Object.keys(Schema).map((field) => {
      const schemaField = Schema[field]
      const { title, enumLabels, textOptions } = View.columns[field] || {}
      const column: Column = dropUndef({
        field,
        title: title || field,
        form: schemaField.type.form,
        formOptions: schemaField.type.formOptions,
        searchable: schemaField.searchable || undefined,
        // access policy で readonly になることがある
        readonly: schemaField.readonly || undefined,
        readonlyOnCreate: userAccessPolicy.ofCreate?.uneditableColumns?.includes(
          field,
        ),
        readonlyOnUpdate: userAccessPolicy.ofUpdate?.uneditableColumns?.includes(
          field,
        ),
        entityColumnProperties: schemaField.entityProperties,
        enumColumnProperties: enumLabels
          ? {
              multiple: schemaField.type.rawType === 'text_list',
              labels: Object.entries(enumLabels).map(([value, label]) => ({
                value,
                label,
              })),
            }
          : undefined,
        textColumnProperties: textOptions
          ? { isLink: Boolean(textOptions.isLink) }
          : undefined,
      })
      return column
    })

    const permissions: SheetInfo['permissions'] = {
      creates: Boolean(userAccessPolicy.ofCreate),
      updates: Boolean(userAccessPolicy.ofUpdate),
      deletes: Boolean(userAccessPolicy.ofDelete),
    }
    return {
      sheetName,
      columns,
      permissions,
    }
  }

  async list({ page, limit, search, sort }: ListQuery): Promise<ListResult> {
    const readPolicy = this.userAccessPolicy.ofRead
    if (!readPolicy) {
      throw new HttpError('Permission denied', HttpStatuses.FORBIDDEN)
    }
    const { Schema } = this.sheet
    const { queryFilter = {} } = readPolicy
    const searchColumns = Object.keys(Schema).filter(
      (field) => Schema[field]?.searchable,
    )
    const query =
      search && searchColumns.length > 0
        ? {
            ...queryFilter,
            $or: searchColumns.map((column) => ({
              [column]: {
                // Needs to escape?
                $regex: new RegExp(search, 'i'),
              },
            })),
          }
        : queryFilter
    const entityFields = Object.keys(Schema).filter((field) =>
      Boolean(Schema[field]?.entityProperties),
    )
    const { docs, total, pages = 0 } = await paginate.call(this.Model, query, {
      sort: sort.join(' '),
      populate: entityFields,
      page,
      limit,
    })
    const entities = docs.map((entity) =>
      this.converter.beforeSend(entity.toObject()),
    )
    return {
      entities,
      total,
      page,
      pages,
    }
  }

  async one(id: string) {
    const readPolicy = this.userAccessPolicy.ofRead
    if (!readPolicy) {
      throw new HttpError('Permission denied', HttpStatuses.FORBIDDEN)
    }
    const { queryFilter = {} } = readPolicy
    const entity = await this.Model.findOne({
      id,
      ...queryFilter,
    })
    if (!entity) {
      throw new HttpError('Not found', HttpStatuses.NOT_FOUND)
    }
    return this.converter.beforeSend(entity.toObject())
  }

  async create(input: any) {
    const createPolicy = this.userAccessPolicy.ofCreate
    if (!createPolicy) {
      throw new HttpError('Permission denied', HttpStatuses.FORBIDDEN)
    }
    await this.validator.validate(input, null)
    const creating = this.converter.beforeSave(input)
    const doc = await this.Model.create({
      ...creating,
      id: uuid(),
    })
    const entity = doc.toObject()
    await this.hook.triggerCreate(entity, this.ctx)
    return this.converter.beforeSend(entity)
  }

  async update(id: string, changes: any) {
    const updatePolicy = this.userAccessPolicy.ofUpdate
    if (!updatePolicy) {
      throw new HttpError('Permission denied', HttpStatuses.FORBIDDEN)
    }
    const doc = await this.Model.findOne({ id })
    const current = doc?.toObject()!
    if (!doc) {
      throw new HttpError(`Entity not found "${id}"`, HttpStatuses.NOT_FOUND)
    }
    if (updatePolicy.condition?.(current) === false) {
      throw new HttpError('Permission denied', HttpStatuses.FORBIDDEN)
    }
    await this.validator.validate(changes, current)
    const updating = this.converter.beforeSave(changes)
    await this.Model.updateOne({ id }, updating)
    const entity = (await this.Model.findOne({ id }))!.toObject()
    await this.hook.triggerUpdate(entity, this.ctx)
    return this.converter.beforeSend(entity)
  }

  async delete(id: string) {
    const deletePolicy = this.userAccessPolicy.ofDelete
    if (!deletePolicy) {
      throw new HttpError('Permission denied', HttpStatuses.FORBIDDEN)
    }
    const doc = await this.Model.findOne({ id })
    const entity = doc?.toObject()
    if (deletePolicy.condition?.(entity) === false) {
      throw new HttpError('Permission denied', HttpStatuses.FORBIDDEN)
    }
    await this.Model.deleteOne({ id })
    await this.hook.triggerDestroy(entity, this.ctx)
  }
}
