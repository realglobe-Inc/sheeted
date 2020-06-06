import { Document, Model as MongoModel, CreateQuery } from 'mongoose'
import {
  Repository,
  RepositoryDriver,
  FindListQuery,
  FindListResult,
  EntityBase,
  EntityId,
  Schema,
} from '@sheeted/core'

import { compileModel } from './MongooseModel'

/** @internal */
class MongoRepositoryImpl<Entity> implements Repository<Entity> {
  private readonly model: MongoModel<EntityBase & Document>

  constructor(name: string, schema: Schema<Entity>) {
    this.model = compileModel<EntityBase>(name, schema)
  }

  async find(
    condition: FindListQuery<Entity>,
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
    const [entities, total] = await Promise.all([
      (await query).map((doc) => doc.toJSON() as Entity),
      this.model.countDocuments(conditions),
    ])
    return {
      page,
      pages: Math.ceil(total / limit),
      total,
      entities,
    }
  }

  async findById(id: EntityId): Promise<Entity | null> {
    const doc = await this.model.findOne({ id })
    return (doc?.toJSON() as Entity) || null
  }

  async findByIds(ids: EntityId[]): Promise<{ [id: string]: Entity | null }> {
    const docs = await this.model.find({
      $or: ids.map((id) => ({
        id,
      })),
    })
    const map = Object.fromEntries(
      docs.map((doc) => [doc.id, doc.toJSON()] as [string, Entity]),
    )
    const entities = Object.fromEntries(ids.map((id) => [id, map[id] || null]))
    return entities
  }

  async findOne(filter: Partial<Entity>): Promise<Entity | null> {
    const doc = await this.model.findOne(filter)
    return (doc?.toJSON() as Entity) || null
  }

  async create(input: Partial<Entity>): Promise<Entity> {
    const doc = await this.model.create(input as CreateQuery<Entity>)
    return doc.toJSON() as Entity
  }

  async createBulk(inputs: Partial<Entity>[]): Promise<Entity[]> {
    const docs = await this.model.create(inputs as CreateQuery<Entity>[])
    return docs.map((doc) => doc.toJSON() as Entity)
  }

  async update(id: EntityId, input: Partial<Entity>): Promise<Entity> {
    await this.model.updateOne({ id }, input)
    const updated = await this.findById(id)
    return updated!
  }

  async updateBulk(
    ids: EntityId[],
    changes: Partial<Entity>,
  ): Promise<(Entity | null)[]> {
    await this.model.updateMany(
      {
        id: { $in: ids },
      },
      changes,
    )
    const docs = await this.model.find({ id: { $in: ids } })
    const entities = docs.map((doc) => doc.toJSON() as Entity)
    return ids.map(
      (id) =>
        entities.find(
          (entity) =>
            Object.getOwnPropertyDescriptor(entity, 'id')?.value === id,
        ) || null,
    )
  }

  async destroy(id: EntityId): Promise<void> {
    await this.model.deleteOne({ id })
  }

  async destroyBulk(ids: EntityId[]): Promise<void> {
    await this.model.deleteMany({ id: { $in: ids } })
  }
}

/**
 * The database driver for mongoose.
 */
export const MongoDriver: RepositoryDriver = MongoRepositoryImpl
