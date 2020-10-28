import { EntityBase, DefaultIAMRoles, Repository } from '@sheeted/core'
import { createEntityId } from '@sheeted/mongoose'

export interface ISeeder {
  seed(): Promise<void>
}

export class Seeder<E extends EntityBase> implements ISeeder {
  constructor(
    private repository: Repository<EntityBase>,
    private data: Partial<E>[],
  ) {}

  async seed(): Promise<void> {
    let count = 0
    for (const entity of this.data.reverse()) {
      const found = await this.repository.findById(entity.id!)
      if (!found) {
        await this.repository.create(entity)
        count++
      }
    }
    console.log(
      `[SEED] Created ${count} new entities in ${this.repository.name} collection`,
    )
  }
}

export const reduce = (seederList: Seeder<any>[]): ISeeder => ({
  async seed(): Promise<void> {
    for (const seeder of seederList) {
      await seeder.seed()
    }
    console.log('')
  },
})

export const defaultUsers = [
  {
    id: createEntityId(0),
    name: 'demo',
    email: `demo@example.com`,
    roles: [DefaultIAMRoles.DEFAULT_ROLE],
  },
  {
    id: createEntityId(1),
    name: 'admin',
    email: `admin@example.com`,
    roles: [DefaultIAMRoles.ADMIN_ROLE],
  },
]
