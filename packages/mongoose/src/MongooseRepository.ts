import mongoose, { Document, Model as MongoModel, CreateQuery } from 'mongoose'
import {
  Repository,
  RepositoryDriver,
  FindListQuery,
  FindListResult,
  EntityBase,
  EntityId,
  Schema,
  TransactionOption,
} from '@sheeted/core'

import { compileModel } from './MongooseModel'
import { convertInput, deleteMetaFields, objectIdOrNull } from './Utils'

/** @internal */
class MongoRepositoryImpl<Entity> implements Repository<Entity> {
  private readonly model: MongoModel<Partial<EntityBase> & Document>

  constructor(name: string, schema: Schema<Entity>) {
    this.model = compileModel<EntityBase>(name, schema)
  }

  async initialize(): Promise<void> {
    // See https://mongoosejs.com/docs/api/model.html#model_Model.createCollection
    // > Note 1: You may need to call this before starting a transaction
    // > Note 2: You don't have to call this if your schema contains index or unique field. In that case, just use Model.init()
    await this.model.init()
  }

  async transaction<R>(callback: (transaction: any) => Promise<R>): Promise<R> {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const result = await callback(session)
      await session.commitTransaction()
      return result
    } catch (e) {
      await session.abortTransaction()
      throw e
    } finally {
      session.endSession()
    }
  }

  async find(
    condition: FindListQuery<Entity>,
    options?: TransactionOption,
  ): Promise<FindListResult<Entity>> {
    const { page, limit, sort, search, filter = {} } = condition
    const skip = limit * (page - 1)
    const sortQuery = Object.fromEntries(
      sort.map(({ field, order }) => [field, order]),
    )
    const hasSearchCondition = Boolean(
      search && search.fields.length > 0 && search.words.length > 0,
    )
    const _filter = convertInput(filter)
    const conditions = hasSearchCondition
      ? {
          ..._filter,
          $or: search!.fields.map((field) => ({
            $and: search!.words.map((word) => ({
              [field]: {
                $regex: new RegExp(word, 'i'),
              },
            })),
          })),
        }
      : _filter
    const query = this.model
      .find(conditions)
      .sort(sortQuery)
      .limit(limit)
      .skip(skip)
      .session(options?.transaction)
    const [entities, total] = await Promise.all([
      (await query).map((doc) => doc.toJSON() as Entity),
      this.model.countDocuments(conditions).session(options?.transaction),
    ])
    entities.forEach(deleteMetaFields)
    return {
      page,
      pages: Math.ceil(total / limit),
      total,
      entities,
    }
  }

  async findById(
    id: EntityId,
    options?: TransactionOption,
  ): Promise<Entity | null> {
    const _id = objectIdOrNull(id)
    const doc = await this.model.findById(_id).session(options?.transaction)
    const entity = doc?.toJSON()
    if (!entity) {
      return null
    }
    deleteMetaFields(entity)
    return entity as Entity
  }

  async findByIds(
    ids: EntityId[],
    options?: TransactionOption,
  ): Promise<{ [id: string]: Entity | null }> {
    const docs = await this.model
      .find({
        $or: ids.map((id) => ({
          _id: objectIdOrNull(id),
        })),
      })
      .session(options?.transaction)
    const map = Object.fromEntries(
      docs.map((doc) => [doc.id, doc.toJSON()] as [string, Entity]),
    )
    Object.values(map).forEach(deleteMetaFields)
    const entities = Object.fromEntries(ids.map((id) => [id, map[id] || null]))
    return entities
  }

  async findOne(
    filter: Partial<Entity>,
    options?: TransactionOption,
  ): Promise<Entity | null> {
    let _filter = convertInput(filter)
    // id を _id にすり替える
    if (_filter.id) {
      _filter = {
        ..._filter,
        _id: _filter.id,
      }
      delete _filter.id
    }
    const doc = await this.model.findOne(_filter).session(options?.transaction)
    const entity = doc?.toJSON()
    if (!entity) {
      return null
    }
    deleteMetaFields(entity)
    return entity as Entity
  }

  async create(
    input: Partial<Entity>,
    options?: TransactionOption,
  ): Promise<Entity> {
    const _input = convertInput(input)
    const [doc] = await this.model.create([_input as CreateQuery<Entity>], {
      session: options?.transaction,
    })
    const entity: Entity = doc.toJSON()
    deleteMetaFields(entity)
    return entity
  }

  async createBulk(
    inputs: Partial<Entity>[],
    options?: TransactionOption,
  ): Promise<Entity[]> {
    const _inputs = inputs.map(convertInput)
    const docs = await this.model.create(_inputs as CreateQuery<Entity>[], {
      session: options?.transaction,
    })
    const entities: Entity[] = docs.map((doc) => doc.toJSON() as Entity)
    entities.forEach(deleteMetaFields)
    return entities
  }

  async update(
    id: EntityId,
    changes: Partial<Entity>,
    options?: TransactionOption,
  ): Promise<Entity> {
    const _changes = convertInput(changes)
    await this.model.updateOne(
      { _id: id },
      { updatedAt: Date.now(), ..._changes },
      {
        session: options?.transaction,
      },
    )
    const updated = await this.findById(id, options)
    return updated!
  }

  async updateBulk(
    ids: EntityId[],
    changes: Partial<Entity>,
    options?: TransactionOption,
  ): Promise<(Entity | null)[]> {
    const _changes = convertInput(changes)
    await this.model.updateMany(
      {
        _id: { $in: ids.map(objectIdOrNull) },
      },
      {
        updatedAt: Date.now(),
        ..._changes,
      },
      {
        session: options?.transaction,
      },
    )
    const docs = await this.model
      .find({ _id: { $in: ids } })
      .session(options?.transaction)
    const entities = docs.map((doc) => doc.toJSON() as Entity)
    entities.forEach(deleteMetaFields)
    return ids.map(
      (id) =>
        entities.find(
          (entity) =>
            Object.getOwnPropertyDescriptor(entity, 'id')?.value === id,
        ) || null,
    )
  }

  async destroy(id: EntityId, options?: TransactionOption): Promise<void> {
    await this.model.deleteOne(
      { _id: id },
      {
        session: options?.transaction,
      },
    )
  }

  async destroyBulk(
    ids: EntityId[],
    options?: TransactionOption,
  ): Promise<void> {
    await this.model.deleteMany(
      { _id: { $in: ids.map(objectIdOrNull) } },
      {
        session: options?.transaction,
      },
    )
  }
}

/**
 * The database driver for mongoose.
 */
export const MongoDriver: RepositoryDriver = MongoRepositoryImpl
