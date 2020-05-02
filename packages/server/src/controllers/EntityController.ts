import {
  Sheet,
  Context,
  Repositories,
  Repository,
  SearchQuery,
  SortQuery,
  EntityBase,
} from '@sheeted/core'
import { Request } from 'express'
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
    repositories: Repositories,
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
    const repository = repositories.get<any>(sheetName)
    return new EntityController(sheet, ctx, displays, repository)
  }

  private readonly userRoles: string[]
  private readonly userAccessPolicy: UserAccessPolicy
  private readonly converter: EntityConverter
  private readonly validator: EntityValidator
  private readonly hook: HookTrigger

  constructor(
    private readonly sheet: Sheet,
    private readonly ctx: Context<string>,
    displays: DisplayFunctions,
    private readonly repository: Repository<EntityBase>,
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
    this.validator = new EntityValidator(
      Schema,
      sheet.Validator(ctx),
      repository,
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
    const searchFields = Object.keys(Schema).filter(
      (field) => Schema[field]?.searchable,
    )
    const words = search.split(/\s/).filter(Boolean)
    const searchQuery: SearchQuery<any> | undefined =
      searchFields.length > 0 ? { fields: searchFields, words } : undefined
    const sortQuery: SortQuery<any>[] = sort.map((field) => ({
      field, // FIXME: '' なら asc、 '-' なら desc
      order: 'asc',
    }))
    const result = await this.repository.find({
      page,
      limit,
      search: searchQuery,
      sort: sortQuery,
      filter: queryFilter,
    })
    const entities = result.entities.map((entity) =>
      this.converter.beforeSend(entity),
    )
    const { total, pages } = result
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
    const entity = await this.repository.findOne({
      id,
      ...queryFilter,
    })
    if (!entity) {
      throw new HttpError('Not found', HttpStatuses.NOT_FOUND)
    }
    return this.converter.beforeSend(entity)
  }

  async create(input: any) {
    const createPolicy = this.userAccessPolicy.ofCreate
    if (!createPolicy) {
      throw new HttpError('Permission denied', HttpStatuses.FORBIDDEN)
    }
    await this.validator.validate(input, null)
    const creating = this.converter.beforeSave(input)
    const entity = await this.repository.create(creating)
    await this.hook.triggerCreate(entity, this.ctx)
    return this.converter.beforeSend(entity)
  }

  async update(id: string, changes: any) {
    const updatePolicy = this.userAccessPolicy.ofUpdate
    if (!updatePolicy) {
      throw new HttpError('Permission denied', HttpStatuses.FORBIDDEN)
    }
    const current = await this.repository.findById(id)
    if (!current) {
      throw new HttpError(`Entity not found "${id}"`, HttpStatuses.NOT_FOUND)
    }
    if (updatePolicy.condition?.(current) === false) {
      throw new HttpError('Permission denied', HttpStatuses.FORBIDDEN)
    }
    await this.validator.validate(changes, current)
    const updating = this.converter.beforeSave(changes)
    const entity = await this.repository.update(id, updating)
    await this.hook.triggerUpdate(entity, this.ctx)
    return this.converter.beforeSend(entity)
  }

  async delete(ids: string[]) {
    const deletePolicy = this.userAccessPolicy.ofDelete
    if (!deletePolicy) {
      throw new HttpError('Permission denied', HttpStatuses.FORBIDDEN)
    }
    const entity = await this.repository.findByIds(ids)
    if (deletePolicy.condition?.(entity) === false) {
      throw new HttpError('Permission denied', HttpStatuses.FORBIDDEN)
    }
    await this.repository.destroyBulk(ids)
    await Promise.all()
    await this.hook.triggerDestroy(entity, this.ctx)
  }
}
