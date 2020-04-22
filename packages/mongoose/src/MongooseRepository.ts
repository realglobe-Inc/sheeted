import { Document, Model as MongoModel } from 'mongoose'
import {
  Repository,
  FindListQuery,
  FindListResult,
  EntityBase,
  EntityId,
} from '@sheeted/core'

/**
 * Mongo repository implementation
 */
export class MongoRepository<Entity> implements Repository<Entity> {
  constructor(private readonly model: MongoModel<EntityBase & Document>) {}

  async find(
    condition: FindListQuery<Entity>,
  ): Promise<FindListResult<Entity>> {
    const { page, limit, sort, search, filter = {} } = condition
    const skip = limit * (page - 1)
    const sortQuery = Object.fromEntries(
      sort.map(({ field, order }) => [field, order]),
    )
    const conditions = search
      ? {
          ...filter,
          $or: search.fields.map((field) => ({
            $and: search.words.map((word) => ({
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
    return doc?.toJSON() || null
  }

  async create(input: Partial<Entity>): Promise<Entity> {
    const doc = await this.model.create(input)
    return doc.toJSON()
  }

  async createBulk(inputs: Partial<Entity>[]): Promise<Entity[]> {
    const docs = await this.model.create(inputs)
    return docs.map((doc) => doc.toJSON())
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
      (id) => entities.find((entity) => (entity as any).id === id) || null,
    )
  }

  async destroy(id: EntityId): Promise<void> {
    await this.model.deleteOne({ id })
  }

  async destroyBulk(ids: EntityId[]): Promise<void> {
    await this.model.deleteMany({ id: { $in: ids } })
  }
}
