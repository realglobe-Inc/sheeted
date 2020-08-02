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

/** @internal */
class MongoRepositoryImpl<Entity> implements Repository<Entity> {
  private readonly model: MongoModel<Partial<EntityBase> & Document>

  constructor(name: string, schema: Schema<Entity>) {
    this.model = compileModel<EntityBase>(name, schema)
  }

  async initialize(): Promise<void> {
    await this.model.createCollection()
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
    const conditions = hasSearchCondition
      ? {
          ...filter,
          $or: search!.fields.map((field) => ({
            $and: search!.words.map((word) => ({
              [field]: {
                $regex: new RegExp(word, 'i'),
              },
            })),
          })),
        }
      : filter
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
    const doc = await this.model.findOne({ id }).session(options?.transaction)
    return (doc?.toJSON() as Entity) || null
  }

  async findByIds(
    ids: EntityId[],
    options?: TransactionOption,
  ): Promise<{ [id: string]: Entity | null }> {
    const docs = await this.model
      .find({
        $or: ids.map((id) => ({
          id,
        })),
      })
      .session(options?.transaction)
    const map = Object.fromEntries(
      docs.map((doc) => [doc.id, doc.toJSON()] as [string, Entity]),
    )
    const entities = Object.fromEntries(ids.map((id) => [id, map[id] || null]))
    return entities
  }

  async findOne(
    filter: Partial<Entity>,
    options?: TransactionOption,
  ): Promise<Entity | null> {
    const doc = await this.model.findOne(filter).session(options?.transaction)
    return (doc?.toJSON() as Entity) || null
  }

  async create(
    input: Partial<Entity>,
    options?: TransactionOption,
  ): Promise<Entity> {
    const [doc] = await this.model.create([input as CreateQuery<Entity>], {
      session: options?.transaction,
    })
    return doc.toJSON() as Entity
  }

  async createBulk(
    inputs: Partial<Entity>[],
    options?: TransactionOption,
  ): Promise<Entity[]> {
    const docs = await this.model.create(inputs as CreateQuery<Entity>[], {
      session: options?.transaction,
    })
    return docs.map((doc) => doc.toJSON() as Entity)
  }

  async update(
    id: EntityId,
    input: Partial<Entity>,
    options?: TransactionOption,
  ): Promise<Entity> {
    await this.model.updateOne(
      { id },
      { updatedAt: Date.now(), ...input },
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
    await this.model.updateMany(
      {
        id: { $in: ids },
      },
      {
        updatedAt: Date.now(),
        ...changes,
      },
      {
        session: options?.transaction,
      },
    )
    const docs = await this.model
      .find({ id: { $in: ids } })
      .session(options?.transaction)
    const entities = docs.map((doc) => doc.toJSON() as Entity)
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
      { id },
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
      { id: { $in: ids } },
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
