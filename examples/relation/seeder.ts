import { createEntityId } from '@sheeted/mongoose'

import { Seeder, reduce } from '../util/seeder.util'

import { EntityAEntity } from './sheets/entity-a/entity-a.entity'
import { EntityARepository } from './sheets/entity-a/entity-a.repository'
import { EntityBEntity } from './sheets/entity-b/entity-b.entity'
import { EntityBRepository } from './sheets/entity-b/entity-b.repository'
import { EntityCEntity } from './sheets/entity-c/entity-c.entity'
import { EntityCRepository } from './sheets/entity-c/entity-c.repository'
import { EntityDEntity } from './sheets/entity-d/entity-d.entity'
import { EntityDRepository } from './sheets/entity-d/entity-d.repository'

const a: Partial<EntityAEntity>[] = [
  {
    id: createEntityId(1),
    name: 'a 01',
  },
  {
    id: createEntityId(2),
    name: 'a 02',
  },
  {
    id: createEntityId(3),
    name: 'a 03',
  },
]
const b: EntityBEntity[] = [
  {
    id: createEntityId(1),
    cascade: a[0],
  } as any,
  {
    id: createEntityId(2),
    restrict: a[1],
  },
  {
    id: createEntityId(3),
    setNull: a[2],
  },
]
const c: EntityCEntity[] = [
  {
    id: createEntityId(1),
    a: a[0],
  } as any,
  {
    id: createEntityId(2),
    a: a[1],
  },
  {
    id: createEntityId(3),
    a: a[2],
  },
]
const d: EntityDEntity[] = [
  {
    id: createEntityId(1),
    cascade: c[0],
  } as any,
  {
    id: createEntityId(2),
    cascade: c[0],
  },
  {
    id: createEntityId(3),
    restrict: c[1],
  },
  {
    id: createEntityId(4),
    restrict: c[1],
  },
  {
    id: createEntityId(5),
    setNull: c[2],
  },
  {
    id: createEntityId(6),
    setNull: c[2],
  },
]

export const seeders = reduce([
  new Seeder<EntityAEntity>(EntityARepository, a),
  new Seeder<EntityBEntity>(EntityBRepository, b),
  new Seeder<EntityCEntity>(EntityCRepository, c),
  new Seeder<EntityDEntity>(EntityDRepository, d),
])
