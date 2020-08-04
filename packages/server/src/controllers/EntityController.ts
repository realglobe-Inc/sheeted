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
  DeleteResult,
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
    const created = await this.repository.transaction(async (t) => {
      const entity = await this.repository.create(creating, { transaction: t })
      await this.hook.triggerCreate(entity, { transaction: t })
      // hook により entity が変化したかもしれない
      const created = (await this.repository.findById(entity.id, {
        transaction: t,
      }))!
      return created
    })
    return this.converter.beforeSend(created)
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
    const updated = await this.repository.transaction(async (t) => {
      const entity = await this.repository.update(id, updating, {
        transaction: t,
      })
      await this.hook.triggerUpdate(entity, { transaction: t })
      // hook により entity が変化したかもしれない
      const updated = (await this.repository.findById(id, { transaction: t }))!
      return updated
    })
    return this.converter.beforeSend(updated)
  }

  async delete(ids: string[]): Promise<DeleteResult> {
    if (
      !(ids && Array.isArray(ids) && ids.every((id) => typeof id === 'string'))
    ) {
      throw new HttpError('Invalid body', HttpStatuses.BAD_REQUEST)
    }
    const deletePolicy = this.userAccessPolicy.ofDelete
    if (!deletePolicy) {
      throw new HttpError('Permission denied', HttpStatuses.FORBIDDEN)
    }
    const result: DeleteResult = {
      success: [],
      failure: [],
    }
    const entities = await this.repository.findByIds(ids)

    const isFound = (id: string) => Boolean(entities[id])
    const notFound = ids
      .filter((id) => !isFound(id))
      .map((id) => ({
        entity: this.converter.beforeSend(entities[id]!) as any,
        reason: 'NOT_FOUND' as const,
      }))
    result.failure = result.failure.concat(notFound)

    const isPermitted = (id: string) =>
      Boolean(
        isFound(id) &&
          deletePolicy &&
          (deletePolicy.condition
            ? deletePolicy.condition(entities[id], this.ctx as Context<any>)
            : true),
      )
    const forbidden = ids
      .filter((id) => isFound(id) && !isPermitted(id))
      .map((id) => ({
        entity: this.converter.beforeSend(entities[id]!) as any,
        reason: 'RESTRICT' as const,
      }))
    result.failure = result.failure.concat(forbidden)

    const targedIds = ids.filter((id) => isFound(id) && isPermitted(id))

    for (const id of targedIds) {
      const entity = entities[id]
      if (!entity) {
        continue
      }
      const converted = this.converter.beforeSend(entity) as any
      try {
        // transaction for each entity
        await this.repository.transaction(async (t) => {
          const related = await this.deleteTransaction.find(
            this.sheet.name,
            entity,
          )
          await this.deleteTransaction.transact(related, { transaction: t })
          await this.repository.destroy(entity.id, { transaction: t })
          await this.hook.triggerDestroy(entity, { transaction: t })
        })
        result.success.push(converted)
      } catch (e) {
        if (process.env.NODE_ENV !== 'test') {
          console.error(e)
        }
        if (e instanceof RestrictViolationError) {
          result.failure.push({
            entity: converted,
            reason: 'RESTRICT',
          })
        } else {
          result.failure.push({
            entity: converted,
            reason: 'OTHER',
            message: (e as Error).message || 'Unexpected error',
          })
        }
      }
    }
    return result
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
    await this.repository.transaction(async (t) => {
      await action.perform(entities, ctx, { transaction: t })
    })
  }
}
