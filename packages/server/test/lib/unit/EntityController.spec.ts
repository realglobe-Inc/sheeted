import mongoose from 'mongoose'
import { DefaultIAMRoles, IAM_USER_SHEET } from '@sheeted/core'
import { SheetInfo } from '@sheeted/core/build/web/Shared.type'
import { ENTITY_META_FIELD } from '@sheeted/core/build/web/Consts'
import { buildIAMUserSheet } from '@sheeted/core/build/sheets/IAMUserSheet/IAMUserSheetBuilder'

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
  App1Entity,
  app1Repository,
  app1Model,
} from '../../fixtures/apps/app1/Application'

const roles = [
  { label: 'ADMIN', value: DefaultIAMRoles.ADMIN_ROLE },
  { label: 'USER', value: DefaultIAMRoles.DEFAULT_ROLE },
]

beforeEach(async () => {
  await connectMongo()

  await app1Model.deleteMany({})
  await userModel.deleteMany({})
  await userModel.create(adminUser)
})

afterEach(async () => {
  await mongoose.disconnect()
})

test('EntityController with IAMUser with admin', async () => {
  const sheet = buildIAMUserSheet(roles)

  const controller = new EntityController(
    sheet,
    {
      user: adminUser,
    },
    {
      [IAM_USER_SHEET]: sheet.View.display,
    },
    userRepository,
  )

  const expected: SheetInfo = {
    sheetName: IAM_USER_SHEET,
    columns: [
      {
        field: 'name',
        title: 'User name',
        searchable: true,
        form: 'text',
      },
      {
        field: 'email',
        title: 'Email',
        searchable: true,
        form: 'text',
      },
      {
        field: 'roles',
        title: 'Roles',
        form: 'select-multiple',
        enumColumnProperties: {
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
    ],
    permissions: { creates: true, updates: true, deletes: true },
  }
  expect(await controller.info()).toEqual(expected)

  const user = await controller.create({
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
    await controller.list({ page: 1, limit: 10, search: '', sort: [] }),
  ).toMatchObject({
    total: 2,
    pages: 1,
  })
  await controller.delete(user.id)
  await expect(controller.one(user.id)).rejects.toBeTruthy()
})

test('EntityController with IAMUser with guest', async () => {
  const sheet = buildIAMUserSheet(roles)

  const controller = new EntityController(
    sheet,
    {
      user: defaultUser,
    },
    {
      [IAM_USER_SHEET]: sheet.View.display,
    },
    userRepository,
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
  await expect(controller.delete(adminUser.id)).rejects.toMatchObject({
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
  )

  const entity = await controller.create({
    n: 10,
  })
  expect(entity).toMatchObject({
    n: 10,
  } as App1Entity)
  await controller.update(entity.id, { n: 20 })
  await expect(controller.update(entity.id, { n: 20 })).resolves.toMatchObject({
    n: 20,
  })
})
