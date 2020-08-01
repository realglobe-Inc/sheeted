import '../../tools/typings'
import mongoose from 'mongoose'
import { EntityBase, Schema, Types, Sheet } from '@sheeted/core'
import { MongoDriver, compileModel } from '@sheeted/mongoose'

import {
  RelatedEntityFinder,
  RestrictViolationError,
} from '../../../src/controllers/concern/DeleteRelatedEntitiyFinder'
import { createEntityDeleteRelation } from '../../../src/controllers/concern/EntityDeleteRelation'
import { createRepositories } from '../../../src/server/Repositories'
import { connectMongo } from '../../tools/mongoose'

beforeAll(async () => {
  await connectMongo()
})

afterAll(async () => {
  await mongoose.disconnect()
})

test('RelatedEntityFinder', async () => {
  const SheetNames = {
    A: 'A',
    B: 'B',
    C: 'C',
    D: 'D',
    E: 'D',
  }

  interface AEntity extends EntityBase {
    name: string
  }
  interface BEntity extends EntityBase {
    a: AEntity
  }
  interface CEntity extends EntityBase {
    a: AEntity
  }
  interface DEntity extends EntityBase {
    c: CEntity
  }
  interface EEntity extends EntityBase {
    c: CEntity
    d: DEntity
  }

  const ASchema: Schema<AEntity> = {
    name: {
      type: Types.Text,
    },
  }
  const BSchema: Schema<BEntity> = {
    a: {
      type: Types.Entity,
      entityProperties: {
        sheetName: SheetNames.A,
        onDelete: 'SET_NULL',
      },
    },
  }
  const CSchema: Schema<CEntity> = {
    a: {
      type: Types.Entity,
      entityProperties: {
        sheetName: SheetNames.A,
        onDelete: 'CASCADE',
      },
    },
  }
  const DSchema: Schema<DEntity> = {
    c: {
      type: Types.Entity,
      entityProperties: {
        sheetName: SheetNames.C,
        onDelete: 'CASCADE',
      },
    },
  }
  const ESchema: Schema<EEntity> = {
    c: {
      type: Types.Entity,
      optional: true,
      entityProperties: {
        sheetName: SheetNames.C,
        onDelete: 'SET_NULL',
      },
    },
    d: {
      type: Types.Entity,
      optional: true,
      entityProperties: {
        sheetName: SheetNames.D,
        onDelete: 'CASCADE',
      },
    },
  }
  const sheets = [
    {
      name: SheetNames.A,
      Schema: ASchema,
    },
    {
      name: SheetNames.B,
      Schema: BSchema,
    },
    {
      name: SheetNames.C,
      Schema: CSchema,
    },
    {
      name: SheetNames.D,
      Schema: DSchema,
    },
    {
      name: SheetNames.E,
      Schema: ESchema,
    },
  ] as Sheet[]

  const AModel = compileModel(SheetNames.A, ASchema)
  const BModel = compileModel(SheetNames.B, BSchema)
  const CModel = compileModel(SheetNames.C, CSchema)
  const DModel = compileModel(SheetNames.D, DSchema)
  const EModel = compileModel(SheetNames.E, ESchema)

  await AModel.deleteMany({})
  await BModel.deleteMany({})
  await CModel.deleteMany({})
  await DModel.deleteMany({})
  await EModel.deleteMany({})

  const repositories = createRepositories(sheets, MongoDriver)

  const [a1, a2] = await repositories.get<AEntity>(SheetNames.A).createBulk([
    {
      name: 'a1',
    },
    {
      name: 'a2',
    },
  ])

  await repositories.get<BEntity>(SheetNames.B).createBulk([
    {
      a: a1,
    },
    {
      a: a1,
    },
    {
      a: a2,
    },
  ])
  const [c1, c2] = await repositories.get<CEntity>(SheetNames.C).createBulk([
    {
      a: a1,
    },
    {
      a: a1,
    },
    {
      a: a2,
    },
  ])
  const [d1, d2, d3] = await repositories
    .get<DEntity>(SheetNames.D)
    .createBulk([
      {
        c: c1,
      },
      {
        c: c1,
      },
      {
        c: c2,
      },
    ])
  await repositories.get<EEntity>(SheetNames.E).createBulk([
    {
      c: c1, // set null
    },
    {
      d: d1, // cascade
    },
    {
      d: d2,
    },
  ])

  const relation = createEntityDeleteRelation(sheets)
  const finder = new RelatedEntityFinder(relation, repositories)

  const result = await finder.find(SheetNames.A, a1)
  console.log(JSON.stringify(result, null, 2))
})
