import mongoose from 'mongoose'

import { compileModel, MongoDriver } from '../../src'
import { connectMongo } from '../tools/mongoose'
import { Schema } from '../../../core/src/Schema.type'
import { EntityBase } from '../../../core/src/EntityBase.type'
import { Types } from '../../../core/src/Types'

beforeAll(async () => {
  await connectMongo()
})

afterAll(async () => {
  await mongoose.disconnect()
})

test('MongoDriver/01 simple schema', async () => {
  interface Entity extends EntityBase {
    name: string
  }
  const schema: Schema<Entity> = {
    name: {
      type: Types.Text,
    },
  }
  const model = compileModel('model1', schema)
  await model.deleteMany({})

  const repository = new MongoDriver<Entity>('model1', schema)

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
  interface SubEntity extends EntityBase {
    name: string
  }
  const subSchema: Schema<SubEntity> = {
    name: {
      type: Types.Text,
    },
  }
  const subModel = compileModel('Sub', subSchema)
  await subModel.deleteMany({})
  const [sub1, sub2] = (
    await subModel.insertMany([
      {
        name: 'sub1',
      },
      {
        name: 'sub2',
      },
    ])
  ).map((doc) => doc.toJSON() as SubEntity)

  interface Entity extends EntityBase {
    name: string
    age?: number
    sub?: SubEntity
    tags: string[]
  }
  const schema: Schema<Entity> = {
    name: {
      type: Types.Text,
    },
    age: {
      type: Types.Numeric,
    },
    sub: {
      type: Types.Entity,
      entityProperties: {
        sheetName: 'Sub',
      },
    },
    tags: {
      type: Types.EnumList,
      enumProperties: {
        values: ['tag1', 'tag2', 'aaa'],
      },
    },
  }
  const model = compileModel('model2', schema)
  await model.deleteMany({})
  const repository = new MongoDriver<Entity>('model2', schema)
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
  interface Entity extends EntityBase {
    name: string
  }
  const schema: Schema<Entity> = {
    name: {
      type: Types.Text,
    },
  }
  const model = compileModel('model3', schema)
  await model.deleteMany({})
  const repository = new MongoDriver<Entity>('model3', schema)

  const entity = {
    _id: mongoose.Types.ObjectId.createFromTime(10),
    id: 'id',
    name: 'name',
    createdAt: 10000,
    updatedAt: 10000,
  } as Entity
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
  interface Entity extends EntityBase {
    name: string
  }
  const schema: Schema<Entity> = {
    name: {
      type: Types.Text,
    },
  }

  const model = compileModel('model4', schema)
  await model.deleteMany({})
  const repository = new MongoDriver<Entity>('model4', schema)
  await repository.initialize()

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
  expect(await model.countDocuments({})).toBe(1)
})
