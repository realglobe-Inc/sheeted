import mongoose from 'mongoose'

import { connectMongo } from '../../tools/mongoose'
import { IterableFinder } from '../../../src/controllers/concern/RepositoryHelper'
import {
  app1Repository,
  app1Model,
  App1Entity,
} from '../../fixtures/apps/app1/Application'

beforeAll(async () => {
  await connectMongo()
})

afterAll(async () => {
  await mongoose.disconnect()
})

beforeEach(async () => {
  await app1Model.deleteMany({})
})

test('IterableFinder', async () => {
  await app1Model.create(
    Array.from({ length: 10 }).map(() => ({
      n: 1,
    })),
  )
  await app1Model.create(
    Array.from({ length: 10 }).map(() => ({
      n: 2,
    })),
  )
  const find = IterableFinder(app1Repository, 1)
  let all: App1Entity[] = []
  for await (const entities of find({ n: 1 })) {
    expect(entities).toHaveLength(1)
    all = all.concat(entities)
  }
  expect(all).toHaveLength(10)
})
