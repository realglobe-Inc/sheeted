import { Model, Document, Types } from 'mongoose'
import { EntityBase, DefaultIAMRoles } from '@sheeted/core'

export interface ISeeder {
  seed(): Promise<void>
}

export class Seeder<E extends EntityBase> implements ISeeder {
  constructor(
    private model: Model<EntityBase & Document>,
    private data: (E & { _id?: Types.ObjectId })[],
  ) {}

  async seed(): Promise<void> {
    for (const entity of this.data) {
      const found = await this.model.findOne({ id: entity.id })
      if (!found) {
        const created = await this.model.create(entity)
        console.log('CREATED:', JSON.stringify(created))
      }
    }
  }
}

export const reduce = (seederList: Seeder<any>[]): ISeeder => ({
  async seed(): Promise<void> {
    for (const seeder of seederList) {
      await seeder.seed()
    }
  },
})

export const generateId = (num: number): Types.ObjectId =>
  Types.ObjectId.createFromTime(num)

export const defaultUsers = [
  {
    _id: Types.ObjectId.createFromTime(1000),
    id: 'demo',
    name: 'demo',
    email: `demo@example.com`,
    roles: [DefaultIAMRoles.DEFAULT_ROLE],
  },
  {
    _id: Types.ObjectId.createFromTime(1001),
    id: 'admin',
    name: 'admin',
    email: `admin@example.com`,
    roles: [DefaultIAMRoles.ADMIN_ROLE],
  },
]
