import {
  Sheet,
  Context,
  Repositories,
  Repository,
  EntityBase,
  SchemaField,
  Schema,
} from '@sheeted/core'
import {
  SheetInfo,
  ListQuery,
  ListResult,
  Column,
  ActionInfo,
  DeleteResult,
  ActionResult,
} from '@sheeted/core/build/web/Shared.type'
import {
  HttpStatuses,
  DeleteFailureReasons,
  ActionFailureReasons,
} from '@sheeted/core/build/web/Consts'
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
import { EntityBaseSchema } from './concern/EntityBase'
import { SortBuilder } from './concern/SortBuilder'
import {
  RelatedEntityTransaction,
  RestrictViolationError,
} from './concern/DeleteRelatedEntities'
import { createEntityDeleteRelation } from './concern/EntityDeleteRelation'
import { SearchBuilder } from './concern/SearchBuilder'
import { FilterBuilder } from './concern/FilterBuilder'

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
    const relation = createEntityDeleteRelation(sheets)
    const deleteTransaction = new RelatedEntityTransaction(
      relation,
      repositories,
    )
    const schemas = new Map(sheets.map((sheet) => [sheet.name, sheet.Schema]))
    return new EntityController(
      sheet,
      ctx,
      schemas,
      displays,
      repositories,
      deleteTransaction,
    )
  }

  private readonly repository: Repository<EntityBase>
  private readonly schema: { [field: string]: SchemaField<any> }
  private readonly userRoles: string[]
  private readonly userAccessPolicy: UserAccessPolicy
  private readonly converter: EntityConverter
  private readonly validator: EntityValidator
  private readonly hook: HookTrigger
  private readonly filterBuilder: FilterBuilder
  private readonly searchBuilder: SearchBuilder
  private readonly sortBuilder: SortBuilder

  constructor(
    private readonly sheet: Sheet<any, any>,
    private readonly ctx: Context<string>,
    schemas: Map<string, Schema>,
    displays: DisplayFunctions,
    repositories: Repositories,
    private readonly deleteTransaction: RelatedEntityTransaction,
  ) {
    this.repository = repositories.get<any>(sheet.name)
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
      schemas,
      this.userAccessPolicy,
      displays,
      ctx,
    )
    this.hook = new HookTrigger(ctx, sheet.Hook)
    this.validator = new EntityValidator(
      this.schema,
      sheet.Validator(ctx),
      this.repository,
      this.converter,
    )
    this.filterBuilder = new FilterBuilder(
      this.schema,
      repositories,
      this.converter,
      this.userAccessPolicy.ofRead?.queryFilter,
    )
    this.sortBuilder = new SortBuilder(sheet)
    this.searchBuilder = new SearchBuilder(this.schema)
  }

  info(): SheetInfo {
    const { name: sheetName, View, Actions = [] } = this.sheet
    const { userAccessPolicy } = this
    if (!userAccessPolicy.ofRead) {
      throw new HttpError('Permission denied', HttpStatuses.FORBIDDEN)
    }
    const { schema } = this
    const columns: SheetInfo['columns'] = View.columns.map(
      (rawColumn, index) => {
        const {
          field,
          title,
          style = {},
          detailPageOnly,
          enumLabels,
          textOptions,
          numericOptions,
        } = rawColumn
        const schemaField = schema[field]
        const column: Column = dropUndef({
          field,
          title: title || field,
          form: schemaField.type.form,
          formOptions: schemaField.type.formOptions,
          index,
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
    const result = await this.repository.find({
      page,
      limit,
      search: this.searchBuilder.build(search),
      sort: this.sortBuilder.build(sort),
      filter: await this.filterBuilder.build(filter),
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
        id,
        reason: DeleteFailureReasons.NOT_FOUND,
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
    const notPermitted = ids
      .filter((id) => isFound(id) && !isPermitted(id))
      .map((id) => ({
        id,
        reason: DeleteFailureReasons.PERMISSION_DENIED,
      }))
    result.failure = result.failure.concat(notPermitted)

    const targedIds = ids.filter((id) => isFound(id) && isPermitted(id))

    for (const id of targedIds) {
      const entity = entities[id]
      if (!entity) {
        continue
      }
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
        result.success.push({ id })
      } catch (e) {
        if (process.env.NODE_ENV !== 'test') {
          console.error(e)
        }
        if (e instanceof RestrictViolationError) {
          result.failure.push({
            id,
            reason: DeleteFailureReasons.RESTRICT,
          })
        } else {
          const message =
            Object.getOwnPropertyDescriptor(e, 'message')?.value ||
            JSON.stringify(e)
          result.failure.push({
            id,
            reason: DeleteFailureReasons.CUSTOM,
            message,
          })
        }
      }
    }
    return result
  }

  async performAction(actionId: string, ids: string[]): Promise<ActionResult> {
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
    const result: ActionResult = {
      success: [],
      failure: [],
    }

    const entities = await this.repository.findByIds(ids)
    const isFound = (id: string) => Boolean(entities[id])
    const isPermitted = (id: string) =>
      Boolean(
        isFound(id) &&
          actionPolicy &&
          (actionPolicy.condition
            ? actionPolicy.condition(entities[id], this.ctx as Context<any>)
            : true),
      )

    const notFound = Object.keys(entities)
      .filter((id) => !isFound(id))
      .map((id) => ({
        id,
        reason: ActionFailureReasons.NOT_FOUND,
      }))
    result.failure = result.failure.concat(notFound)

    const notPermitted = Object.keys(entities)
      .filter((id) => isFound(id) && !isPermitted(id))
      .map((id) => ({
        id,
        reason: ActionFailureReasons.PERMISSION_DENIED,
      }))
    result.failure = result.failure.concat(notPermitted)

    const targets = Object.keys(entities)
      .filter((id) => isFound(id) && isPermitted(id))
      .map((id) => entities[id]!)

    for (const entity of targets) {
      const { id } = entity
      try {
        await this.repository.transaction(async (t) => {
          await action.perform(entity, ctx, { transaction: t })
        })
        result.success = result.success.concat({
          id,
        })
      } catch (e) {
        const message =
          Object.getOwnPropertyDescriptor(e, 'message')?.value ||
          JSON.stringify(e)
        result.failure = result.failure.concat({
          id,
          reason: ActionFailureReasons.CUSTOM,
          message,
        })
      }
    }

    return result
  }
}
