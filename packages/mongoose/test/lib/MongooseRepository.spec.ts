import mongoose from 'mongoose'

import { MongoDriver } from '../../src'
import { connectMongo, cleanCollections } from '../tools/mongoose'
import {
  Entity01,
  schema01,
  model01,
  Entity02,
  schema02,
  model02,
} from '../fixtures/models'

beforeAll(async () => {
  await connectMongo()
})

afterAll(async () => {
  await mongoose.disconnect()
})

beforeEach(async () => {
  await cleanCollections()
})

test('MongoDriver/01 simple schema', async () => {
  const repository = new MongoDriver<Entity01>(model01.modelName, schema01)

  const created = await repository.create({
    name: 'foo',
  })
  expect(created).toMatchObject({
    name: 'foo',
  })
  expect(typeof created.createdAt).toBe('number')
  expect(typeof created.updatedAt).toBe('number')
  const updated = await repository.update(created.id, {
    name: 'foo1',
  })
  expect(updated).toMatchObject({
    name: 'foo1',
  })
  await repository.destroy(created.id)
  const notFound = await repository.findById(created.id)
  expect(notFound).toBeNull()

  const createds = await repository.createBulk([
    { name: 'bar' },
    { name: 'baz' },
  ])
  expect(createds).toMatchObject([{ name: 'bar' }, { name: 'baz' }])
  const updateds = await repository.updateBulk(
    createds.map(({ id }) => id),
    { name: 'updated' },
  )
  expect(updateds).toMatchObject([{ name: 'updated' }, { name: 'updated' }])
  const founds = await repository.find({
    page: 1,
    limit: 10,
    sort: [],
    filter: {
      name: 'updated',
    },
  })
  expect(founds.total).toBe(2)
  await repository.destroyBulk(createds.map(({ id }) => id))
  const notFounds = await repository.find({
    page: 1,
    limit: 10,
    sort: [],
    filter: {
      name: 'updated',
    },
  })
  expect(notFounds.total).toBe(0)
})

test('MongoDriver/02 complex queries', async () => {
  const [sub1, sub2] = (
    await model01.insertMany([
      {
        name: 'sub1',
      },
      {
        name: 'sub2',
      },
    ])
  ).map((doc) => doc.toJSON() as Entity01)

  const repository = new MongoDriver<Entity02>(model02.modelName, schema02)
  const inputs = [
    {
      name: 'aaa bbb',
      age: 1,
      sub: sub1,
      tags: [],
    },
    {
      name: 'aaa ccc',
      age: 2,
      sub: sub2,
      tags: ['tag1'],
    },
    {
      name: 'abcd',
      age: 3,
      tags: ['tag1', 'tag2'],
    },
    {
      name: 'xyz',
      age: 100,
      sub: sub1,
      tags: ['tag1', 'tag2', 'aaa ccc'],
    },
  ]
  const entities = await repository.createBulk(inputs)
  expect(entities).toMatchObject(inputs)

  {
    const entityMap = await repository.findByIds([
      entities[0].id,
      entities[1].id,
      'X',
    ])
    expect(entityMap).toEqual({
      [entities[0].id]: entities[0],
      [entities[1].id]: entities[1],
      X: null,
    })
  }
  {
    const { entities } = await repository.find({
      page: 1,
      limit: 1,
      sort: [
        {
          field: 'age',
          order: 'asc',
        },
      ],
    })
    expect(entities).toMatchObject([{ age: 1 }])
  }
  {
    const { entities } = await repository.find({
      page: 3,
      limit: 1,
      sort: [
        {
          field: 'age',
          order: 'asc',
        },
      ],
    })
    expect(entities).toMatchObject([{ age: 3 }])
  }
  {
    const { entities } = await repository.find({
      page: 1,
      limit: 1,
      sort: [
        {
          field: 'age',
          order: 'desc',
        },
      ],
    })
    expect(entities).toMatchObject([{ age: 100 }])
  }
  {
    const { total, entities } = await repository.find({
      page: 1,
      limit: 10,
      sort: [],
      filter: {
        age: 2,
      },
    })
    expect(total).toBe(1)
    expect(entities).toMatchObject([
      {
        name: 'aaa ccc',
      },
    ])
  }
  {
    const { total } = await repository.find({
      page: 1,
      limit: 10,
      sort: [],
      search: {
        fields: ['name', 'tags'],
        words: ['aaa'],
      },
    })
    expect(total).toBe(3)
  }
  {
    const { total } = await repository.find({
      page: 1,
      limit: 10,
      sort: [],
      search: {
        fields: ['name', 'tags'],
        words: ['aaa', 'ccc'],
      },
    })
    expect(total).toBe(2)
  }
})

test('MongoDriver/03 Should be able to set createdAt / updatedAt', async () => {
  const repository = new MongoDriver<Entity01>(model01.modelName, schema01)

  const entity = {
    _id: mongoose.Types.ObjectId.createFromTime(10),
    id: 'id',
    name: 'name',
    createdAt: 10000,
    updatedAt: 10000,
  } as Entity01
  const created = await repository.create(entity)
  expect(created).toMatchObject(entity)

  const changes = {
    name: 'name2',
    createdAt: 20000,
    updatedAt: 20000,
  }
  const updated = await repository.update(entity.id, changes)
  expect(updated).toMatchObject(changes)
})

test('MongoDriver/04 Transaction', async () => {
  const repository = new MongoDriver<Entity01>(model01.modelName, schema01)

  // create 1 entity
  const id = await repository.transaction(async (t) => {
    const created = await repository.create(
      {
        name: 'abc',
      },
      {
        transaction: t,
      },
    )
    return created.id
  })

  expect(await repository.findById(id)).toMatchObject({
    name: 'abc',
  })

  // update 1 entity and create 1 entity
  await expect(() =>
    repository.transaction(async (t) => {
      const updated = await repository.update(
        id,
        { name: 'abcd' },
        { transaction: t },
      )
      expect(updated.name).toBe('abcd')
      await repository.create({ name: 'aaa' }, { transaction: t })

      expect(await repository.findOne({ name: 'abcd' })).toBeNull()
      expect(
        await repository.findOne({ name: 'abcd' }, { transaction: t }),
      ).not.toBeNull()

      // transaction should be aborted
      throw new Error()
    }),
  ).rejects.toBeTruthy()

  expect(await repository.findById(id)).toMatchObject({
    name: 'abc',
  })
  expect(await model01.countDocuments({})).toBe(1)

  const [x, y] = await repository.createBulk([
    {
      name: 'x',
    },
    {
      name: 'y',
    },
  ])
  // bulk update and bulk delete
  await repository.transaction(async (t) => {
    await repository.updateBulk([x.id], { name: 'z' }, { transaction: t })
    await repository.destroyBulk([y.id], { transaction: t })
  })
  expect(await repository.findOne({ name: 'z' })).toBeTruthy()
  expect(await repository.findOne({ name: 'y' })).toBeNull()
})
