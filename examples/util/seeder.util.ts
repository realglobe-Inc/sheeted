import { Model, Document, Types } from 'mongoose'
import { EntityBase } from '@sheeted/core'

export class Seeder<E extends EntityBase> {
  constructor(
    private model: Model<EntityBase & Document>,
    private data: (E & { _id: Types.ObjectId })[],
  ) {}

  async seed() {
    for (const entity of this.data) {
      const found = await this.model.findOne({ id: entity.id })
      if (!found) {
        const created = await this.model.create(entity)
        console.log('CREATED:', JSON.stringify(created))
      }
    }
  }
}

export const reduce = (seederList: Seeder<any>[]) => ({
  async seed() {
    for (const seeder of seederList) {
      await seeder.seed()
    }
  },
})

export const generateId = (num: number) => Types.ObjectId.createFromTime(num)
