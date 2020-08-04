import '../../tools/typings'
import mongoose from 'mongoose'
import {
  DefaultIAMRoles,
  IAM_USER_SHEET,
  IAMUserEntity,
  EntityBase,
  Sheet,
} from '@sheeted/core'
import { SheetInfo } from '@sheeted/core/build/web/Shared.type'
import { ENTITY_META_FIELD } from '@sheeted/core/build/web/Consts'
import { buildIAMUserSheet } from '@sheeted/core/build/sheets/IAMUserSheet/IAMUserSheetBuilder'
import { MongoDriver } from '@sheeted/mongoose'

import { createRepositories } from '../../../src/server/Repositories'
import { connectMongo } from '../../tools/mongoose'
import { EntityController } from '../../../src/controllers/EntityController'
import {
  adminUser,
  defaultUser,
  userModel,
  userRepository,
} from '../../fixtures/db/users'
import {
  App1Sheet,
  app1Repository,
  app1Model,
} from '../../fixtures/apps/app1/Application'
import { createEntityDeleteRelation } from '../../../src/controllers/concern/EntityDeleteRelation'
import { RelatedEntityTransaction } from '../../../src/controllers/concern/DeleteRelatedEntities'

const roles = [
  { label: 'ADMIN', value: DefaultIAMRoles.ADMIN_ROLE },
  { label: 'USER', value: DefaultIAMRoles.DEFAULT_ROLE },
]

beforeAll(async () => {
  await connectMongo()
})

afterAll(async () => {
  await mongoose.disconnect()
})

beforeEach(async () => {
  await app1Model.deleteMany({})
  await userModel.deleteMany({})
  await userModel.create(adminUser)
})

test('EntityController with IAMUser with admin', async () => {
  const sheet = buildIAMUserSheet(roles)
  const sheets = [sheet] as Sheet[]
  const repositories = createRepositories(sheets, MongoDriver)
  const relation = createEntityDeleteRelation(sheets)
  const deleteTransaction = new RelatedEntityTransaction(relation, repositories)

  const controller = new EntityController(
    sheet,
    {
      user: adminUser,
    },
    {
      [IAM_USER_SHEET]: sheet.View.display,
    },
    userRepository,
    deleteTransaction,
  )

  const expected: SheetInfo = {
    sheetName: IAM_USER_SHEET,
    title: sheet.View.title,
    enableDetail: Boolean(sheet.View.enableDetail),
    columns: [
      {
        field: 'name',
        title: 'User name',
        index: 0,
        form: 'text',
        style: {},
        custom: {},
      },
      {
        field: 'email',
        title: 'Email',
        index: 1,
        form: 'text',
        style: {},
        custom: {},
      },
      {
        field: 'roles',
        title: 'Roles',
        form: 'select-multiple',
        index: 2,
        style: {},
        custom: {
          enum: {
            multiple: true,
            labels: [
              {
                label: 'ADMIN',
                value: DefaultIAMRoles.ADMIN_ROLE,
              },
              {
                label: 'USER',
                value: DefaultIAMRoles.DEFAULT_ROLE,
              },
            ],
          },
        },
      },
      {
        field: 'createdAt',
        title: '作成日時',
        form: 'number',
        detailPageOnly: true,
        index: 3,
        readonly: true,
        style: {},
        custom: {
          numeric: {
            formatAsDate: 'YYYY/MM/DD HH:mm:ss',
          },
        },
      },
      {
        field: 'updatedAt',
        title: '更新日時',
        form: 'number',
        detailPageOnly: true,
        index: 4,
        readonly: true,
        style: {},
        custom: {
          numeric: {
            formatAsDate: 'YYYY/MM/DD HH:mm:ss',
          },
        },
      },
    ],
    permissions: { creates: true, updates: true, deletes: true },
    actions: [],
  }
  expect(controller.info()).toEqual(expected)

  // FIXME: 本当は IAMUserEntity の拡張型
  const user: IAMUserEntity = await controller.create({
    name: 'user',
    email: 'user@example.com',
    roles: ['default'],
  })
  expect(user).toMatchObject({
    name: 'user',
    email: 'user@example.com',
    roles: ['default'],
    [ENTITY_META_FIELD]: {
      displayText: 'user',
      permissions: {
        updates: true,
        deletes: true,
      },
    },
  })

  const updated = await controller.update(user.id, { name: 'user01' })
  expect(updated).toMatchObject({
    name: 'user01',
  })

  expect(await controller.one(user.id)).toBeTruthy()
  expect(
    await controller.list({
      page: 1,
      limit: 10,
      search: '',
      sort: [],
      filter: {},
    }),
  ).toMatchObject({
    total: 2,
    pages: 1,
  })
  await controller.delete([user.id])
  await expect(controller.one(user.id)).rejects.toBeTruthy()
})

test('EntityController with IAMUser with guest', async () => {
  const sheet = buildIAMUserSheet(roles)
  const sheets = [sheet] as Sheet[]
  const repositories = createRepositories(sheets, MongoDriver)
  const relation = createEntityDeleteRelation(sheets)
  const deleteTransaction = new RelatedEntityTransaction(relation, repositories)

  const controller = new EntityController(
    sheet,
    {
      user: defaultUser,
    },
    {
      [IAM_USER_SHEET]: sheet.View.display,
    },
    userRepository,
    deleteTransaction,
  )

  await expect(
    controller.create({
      name: 'user',
      email: 'user@example.com',
      roles: [],
    }),
  ).rejects.toMatchObject({
    status: 403,
  })
  await expect(
    controller.update(adminUser.id, {
      name: 'admin01',
    }),
  ).rejects.toMatchObject({
    status: 403,
  })
  await expect(
    controller.update(defaultUser.id, {
      name: 'admin01',
    }),
  ).rejects.toMatchObject({
    status: 403,
  })
  await expect(controller.delete([adminUser.id])).rejects.toMatchObject({
    status: 403,
  })
})

test('EntityController with a sheet', async () => {
  const controller = new EntityController(
    App1Sheet,
    {
      user: adminUser,
    },
    {},
    app1Repository,
    {} as any,
  )

  const entity: EntityBase = await controller.create({
    n: 10,
  })
  expect(entity).toMatchObject({
    n: '10',
  })
  await controller.update(entity.id, { n: 20 })
  await expect(controller.update(entity.id, { n: 20 })).resolves.toMatchObject({
    n: '20',
  })
})

test('EntityController.performAction()', async () => {
  const controller = new EntityController(
    App1Sheet,
    {
      user: defaultUser,
    },
    {},
    app1Repository,
    {} as any,
  )
  const entity = await app1Model.create({
    id: 'entity',
    n: 10,
  } as any)
  // n が10以下なら100にするアクション
  await controller.performAction('set100', [entity.id])
  expect(await app1Model.findOne({ id: entity.id })).toMatchObject({
    n: 100,
  })
  // n がすでに100なら失敗する
  await expect(() =>
    controller.performAction('set100', [entity.id]),
  ).rejects.toBeTruthy()
})

test('EntityController rollback with hook', async () => {
  const sheets = [App1Sheet] as Sheet[]
  const repositories = createRepositories(sheets, MongoDriver)
  const relation = createEntityDeleteRelation(sheets)
  const deleteTransaction = new RelatedEntityTransaction(relation, repositories)

  const controller = new EntityController(
    App1Sheet,
    {
      user: adminUser,
    },
    {},
    app1Repository,
    deleteTransaction,
  )

  // n = 100 にすると Hook でエラーになる
  await expect(
    controller.create({
      n: 100,
    }),
  ).rejects.toMatchObject(new Error('failed'))
  // rollbacked
  await expect(
    controller.list({
      page: 1,
      limit: 10,
      search: '',
      sort: [],
      filter: {},
    }),
  ).resolves.toMatchObject({
    total: 0,
  })

  const entity: EntityBase = await controller.create({ n: 99 })

  // n = 100 にすると Hook でエラーになる
  await expect(
    controller.update(entity.id, {
      n: 100,
    }),
  ).rejects.toMatchObject(new Error('failed'))
  // rollbacked
  await expect(controller.one(entity.id)).resolves.toEqual(entity)

  // n = 99 にすると Hook で失敗する
  expect((await controller.delete([entity.id])).failure).toHaveLength(1)
  await expect(controller.one(entity.id)).resolves.toEqual(entity)
})
