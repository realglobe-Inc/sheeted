import {
  Sheet,
  Context,
  Repositories,
  Repository,
  SearchQuery,
  EntityBase,
  SchemaField,
} from '@sheeted/core'
import {
  SheetInfo,
  ListQuery,
  ListResult,
  Column,
  ActionInfo,
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
import { EntityBaseSchema, EntityBaseColumns } from './concern/EntityBase'
import { SortBuilder } from './concern/SortBuilder'
import {
  RelatedEntityTransaction,
  RestrictViolationError,
} from './concern/DeleteRelatedEntities'
import { createEntityDeleteRelation } from './concern/EntityDeleteRelation'

export class EntityController {
  /**
   * Factory method from request
   */
  static from(
    sheetName: string,
    ctx: Context<string>,
    sheets: Sheet[],
    repositories: Repositories,
  ): EntityController {
    const sheet = sheets.find((sheet) => sheet.name === sheetName)
    if (!sheet) {
      throw new HttpError(
        `Sheet "${sheetName}" not found`,
        HttpStatuses.BAD_REQUEST,
      )
    }
    const displays: DisplayFunctions = getDisplayFunctions(sheets)
    const repository = repositories.get<any>(sheetName)
    const relation = createEntityDeleteRelation(sheets)
    const deleteTransaction = new RelatedEntityTransaction(
      relation,
      repositories,
    )
    return new EntityController(
      sheet,
      ctx,
      displays,
      repository,
      deleteTransaction,
    )
  }

  private readonly schema: { [field: string]: SchemaField<any> }
  private readonly userRoles: string[]
  private readonly userAccessPolicy: UserAccessPolicy
  private readonly converter: EntityConverter
  private readonly validator: EntityValidator
  private readonly hook: HookTrigger
  private readonly sortBuilder: SortBuilder

  constructor(
    private readonly sheet: Sheet<any, any>,
    private readonly ctx: Context<string>,
    displays: DisplayFunctions,
    private readonly repository: Repository<EntityBase>,
    private readonly deleteTransaction: RelatedEntityTransaction,
  ) {
    this.schema = {
      ...sheet.Schema,
      // EntityBaseSchema は上書きできない
      ...EntityBaseSchema,
    }
    this.userRoles = ctx.user.roles
    const columnNames = Object.keys(sheet.Schema)
    this.userAccessPolicy = new UserAccessPolicy(
      this.userRoles,
      sheet.AccessPolicies,
      columnNames,
    )
    this.converter = new EntityConverter(
      sheet.name,
      this.schema,
      this.userAccessPolicy,
      displays,
      ctx,
    )
    this.hook = new HookTrigger(ctx, sheet.Hook)
    this.validator = new EntityValidator(
      this.schema,
      sheet.Validator(ctx),
      repository,
    )
    this.sortBuilder = new SortBuilder(sheet)
  }

  info(): SheetInfo {
    const { name: sheetName, View, Actions = [] } = this.sheet
    const { userAccessPolicy } = this
    if (!userAccessPolicy.ofRead) {
      throw new HttpError('Permission denied', HttpStatuses.FORBIDDEN)
    }
    const { schema } = this
    const viewColumns = {
      // EntityBaseColumns は上書きできる
      ...EntityBaseColumns,
      ...View.columns,
    }
    const columns: SheetInfo['columns'] = Object.keys(schema).map(
      (field, index) => {
        const schemaField = schema[field]
        const {
          title,
          style = {},
          detailPageOnly,
          enumLabels,
          textOptions,
          numericOptions,
        } = viewColumns[field] || {}
        const column: Column = dropUndef({
          field,
          title: title || field,
          form: schemaField.type.form,
          formOptions: schemaField.type.formOptions,
          index,
          searchable: schemaField.searchable || undefined,
          // access policy で readonly になることがある
          readonly: schemaField.readonly || undefined,
          readonlyOnCreate:
            userAccessPolicy.ofCreate?.deniedColumns.includes(field) ||
            undefined,
          readonlyOnUpdate:
            userAccessPolicy.ofUpdate?.deniedColumns.includes(field) ||
            undefined,
          style,
          detailPageOnly: detailPageOnly || undefined,
          custom: {
            entity: schemaField.entityProperties,
            enum: enumLabels
              ? {
                  multiple: schemaField.type.rawType === 'text_list',
                  labels: Object.entries(enumLabels).map(([value, label]) => ({
                    value,
                    label,
                  })),
                }
              : undefined,
            text: textOptions
              ? { isLink: Boolean(textOptions.isLink) }
              : undefined,
            numeric: numericOptions,
          },
        })
        return column
      },
    )

    const title = View.title
    const enableDetail = Boolean(View.enableDetail)
    const permissions: SheetInfo['permissions'] = {
      creates: Boolean(userAccessPolicy.ofCreate),
      updates: Boolean(userAccessPolicy.ofUpdate),
      deletes: Boolean(userAccessPolicy.ofDelete),
    }
    const actions: ActionInfo[] = Actions.map(({ id, title, icon }) => ({
      id,
      title,
      icon,
    }))
    return {
      sheetName,
      title,
      enableDetail,
      columns,
      permissions,
      actions,
    }
  }

  async list({
    page,
    limit,
    search,
    sort,
    filter,
  }: ListQuery): Promise<ListResult> {
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
    const userFilter = this.converter.beforeSave(filter)
    const result = await this.repository.find({
      page,
      limit,
      search: searchQuery,
      sort: this.sortBuilder.build(sort),
      filter: {
        ...userFilter,
        ...queryFilter,
      },
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

  async one(id: string): Promise<any> {
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

  async create(input: Record<string, any>): Promise<any> {
    const createPolicy = this.userAccessPolicy.ofCreate
    if (!createPolicy) {
      throw new HttpError('Permission denied', HttpStatuses.FORBIDDEN)
    }
    await this.validator.validate(input, null)
    const creating = this.converter.beforeSave(input)
    const entity = await this.repository.create(creating)
    try {
      await this.hook.triggerCreate(entity)
    } catch (e) {
      // roleback
      await this.repository.destroy(entity.id)
      throw e
    }
    // hook により entity が変化したかもしれない
    const final = (await this.repository.findById(entity.id))!
    return this.converter.beforeSend(final)
  }

  async update(id: string, changes: Record<string, any>): Promise<any> {
    const updatePolicy = this.userAccessPolicy.ofUpdate
    if (!updatePolicy) {
      throw new HttpError('Permission denied', HttpStatuses.FORBIDDEN)
    }
    const current = await this.repository.findById(id)
    if (!current) {
      throw new HttpError(`Entity not found "${id}"`, HttpStatuses.NOT_FOUND)
    }
    if (updatePolicy.condition?.(current, this.ctx as Context<any>) === false) {
      throw new HttpError('Permission denied', HttpStatuses.FORBIDDEN)
    }
    await this.validator.validate(changes, current)
    const updating = this.converter.beforeSave(changes)
    const entity = await this.repository.update(id, updating)
    try {
      await this.hook.triggerUpdate(entity)
    } catch (e) {
      // rollback
      await this.repository.update(id, current)
      throw e
    }
    // hook により entity が変化したかもしれない
    const final = (await this.repository.findById(entity.id))!
    return this.converter.beforeSend(final)
  }

  async delete(ids: string[]): Promise<any> {
    if (
      !(ids && Array.isArray(ids) && ids.every((id) => typeof id === 'string'))
    ) {
      throw new HttpError('Invalid body', HttpStatuses.BAD_REQUEST)
    }
    const deletePolicy = this.userAccessPolicy.ofDelete
    if (!deletePolicy) {
      throw new HttpError('Permission denied', HttpStatuses.FORBIDDEN)
    }
    const entities = await this.repository.findByIds(ids)
    const forbiddenIds = Object.values(entities)
      .filter((entity): entity is EntityBase =>
        Boolean(
          entity &&
            deletePolicy.condition?.(entity, this.ctx as Context<any>) ===
              false,
        ),
      )
      .map(({ id }) => id)
    if (forbiddenIds.length > 0) {
      throw new HttpError(
        `Permission denied for entities: ${forbiddenIds.join(', ')}`,
        HttpStatuses.FORBIDDEN,
      )
    }
    // FIXME: ちゃんと transaction を使わないと rollback できない
    for (const entity of Object.values(entities)) {
      if (!entity) {
        continue
      }
      const related = await this.deleteTransaction.find(this.sheet.name, entity)
      try {
        await this.deleteTransaction.transact(related)
      } catch (e) {
        if (e instanceof RestrictViolationError) {
          throw new HttpError('', 400)
        } else {
          throw e
        }
      }
    }

    const failedIds = (
      await Promise.all(
        ids.map(async (id) => {
          const entity = entities[id]
          if (!entity) {
            return Promise.resolve(null)
          }
          try {
            await this.hook.triggerDestroy(entity)
            return null
          } catch (e) {
            if (process.env.NODE_ENV !== 'test') {
              console.error(e)
            }
            return id
          }
        }),
      )
    ).filter((id): id is string => Boolean(id))
    if (failedIds.length > 0) {
      // mongoose _id を含めて復元できるか？
      const rollbacking = failedIds
        .map((id) => entities[id])
        .filter((id): id is EntityBase => Boolean(id))
      await this.repository.createBulk(rollbacking)
    }
    return {
      destroyedIds: ids.filter((id) => !failedIds.includes(id)),
      failedIds,
    }
  }

  async performAction(actionId: string, ids: string[]): Promise<any> {
    const ctx = this.ctx as Context<any>
    const action = (this.sheet.Actions || []).find(
      (action) => action.id === actionId,
    )
    if (!action) {
      throw new HttpError(
        `Action "${actionId}" not found`,
        HttpStatuses.BAD_REQUEST,
      )
    }
    if (
      !(ids && Array.isArray(ids) && ids.every((id) => typeof id === 'string'))
    ) {
      throw new HttpError('Invalid body', HttpStatuses.BAD_REQUEST)
    }
    const actionPolicy = (this.userAccessPolicy.ofActions || []).find(
      (policy) => policy.customActionId === actionId,
    )
    if (!actionPolicy) {
      throw new HttpError('Permission denied', HttpStatuses.FORBIDDEN)
    }
    const entityMap = await this.repository.findByIds(ids)
    const forbiddenIds = Object.values(entityMap)
      .filter((entity): entity is EntityBase =>
        Boolean(entity && actionPolicy.condition?.(entity, ctx) === false),
      )
      .map(({ id }) => id)
    if (forbiddenIds.length > 0) {
      throw new HttpError(
        `Permission denied for entities: ${forbiddenIds.join(', ')}`,
        HttpStatuses.FORBIDDEN,
      )
    }
    const entities = Object.values(
      entityMap,
    ).filter((entity): entity is EntityBase => Boolean(entity))
    await action.perform(entities, ctx)
  }
}
