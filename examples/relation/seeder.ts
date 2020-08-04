import { Types } from 'mongoose'

import { Seeder, reduce } from '../util/seeder.util'

import { EntityAEntity } from './sheets/entity-a/entity-a.entity'
import { EntityAModel } from './sheets/entity-a/entity-a.model'
import { EntityBEntity } from './sheets/entity-b/entity-b.entity'
import { EntityBModel } from './sheets/entity-b/entity-b.model'
import { EntityCEntity } from './sheets/entity-c/entity-c.entity'
import { EntityCModel } from './sheets/entity-c/entity-c.model'
import { EntityDEntity } from './sheets/entity-d/entity-d.entity'
import { EntityDModel } from './sheets/entity-d/entity-d.model'

const a: EntityAEntity[] = [
  {
    _id: Types.ObjectId.createFromTime(0),
    id: '01',
    name: 'a 01',
  } as any, // cancel type error
  {
    _id: Types.ObjectId.createFromTime(1),
    id: '02',
    name: 'a 02',
  },
  {
    _id: Types.ObjectId.createFromTime(2),
    id: '03',
    name: 'a 03',
  },
]
const b: EntityBEntity[] = [
  {
    id: '01',
    cascade: a[0],
  } as any,
  {
    id: '02',
    restrict: a[1],
  },
  {
    id: '03',
    setNull: a[2],
  },
]
const c: EntityCEntity[] = [
  {
    _id: Types.ObjectId.createFromTime(0),
    id: '01',
    a: a[0],
  } as any,
  {
    _id: Types.ObjectId.createFromTime(1),
    id: '02',
    a: a[1],
  },
  {
    _id: Types.ObjectId.createFromTime(2),
    id: '03',
    a: a[2],
  },
]
const d: EntityDEntity[] = [
  {
    id: '01',
    cascade: c[0],
  } as any,
  {
    id: '02',
    cascade: c[0],
  },
  {
    id: '03',
    restrict: c[1],
  },
  {
    id: '04',
    restrict: c[1],
  },
  {
    id: '05',
    setNull: c[2],
  },
  {
    id: '06',
    setNull: c[2],
  },
]

export const seeders = reduce([
  new Seeder<EntityAEntity>(EntityAModel, a),
  new Seeder<EntityBEntity>(EntityBModel, b),
  new Seeder<EntityCEntity>(EntityCModel, c),
  new Seeder<EntityDEntity>(EntityDModel, d),
])
