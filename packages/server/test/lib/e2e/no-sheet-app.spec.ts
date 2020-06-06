import '../../tools/typings'
import express from 'express'
import request from 'supertest'
import mongoose from 'mongoose'
import { ApiPathBuilder } from '@sheeted/core/build/web/Paths'
import { IAM_USER_SHEET, DefaultIAMRoles, EntityBase } from '@sheeted/core'
import qs from 'qs'
import { SheetInfo } from '@sheeted/core/build/web/Shared.type'

import { connectMongo } from '../../tools/mongoose'
import { seedUsers, adminUser, userModel } from '../../fixtures/db/users'
import { App, config } from '../../fixtures/apps/no-sheet-app/Application'
import { JWT } from '../../../src/JWT'

let app: express.Application
let authHeader: [string, string]

beforeEach(async () => {
  await connectMongo()
  await userModel.deleteMany({})
  await seedUsers()
  app = App(config)
  const token = await new JWT(config.jwt.secret, config.jwt.expiresIn).sign(
    adminUser,
  )
  authHeader = ['authorization', `Bearer ${token}`]
})

afterEach(async () => {
  await mongoose.disconnect()
})

it('should succeed to get sheets info', async () => {
  await request(app)
    .get(ApiPathBuilder().sheetsPath())
    .set(...authHeader)
    .expect(200, {
      groups: [],
      sheets: [
        {
          sheetName: IAM_USER_SHEET,
          title: 'IAM User',
        },
      ],
    })
})

it('should succeed to get IAMUser sheet info', async () => {
  const expected: SheetInfo = {
    sheetName: IAM_USER_SHEET,
    title: 'IAM User',
    enableDetail: false,
    columns: [
      {
        field: 'name',
        title: 'User name',
        form: 'text',
        index: 0,
        searchable: true,
        custom: {},
      },
      {
        field: 'email',
        title: 'Email',
        form: 'text',
        index: 1,
        searchable: true,
        custom: {},
      },
      {
        field: 'roles',
        title: 'Roles',
        form: 'select-multiple',
        index: 2,
        custom: {
          enum: {
            multiple: true,
            labels: [
              {
                label: DefaultIAMRoles.ADMIN_ROLE,
                value: DefaultIAMRoles.ADMIN_ROLE,
              },
              {
                label: DefaultIAMRoles.DEFAULT_ROLE,
                value: DefaultIAMRoles.DEFAULT_ROLE,
              },
            ],
          },
        },
      },
    ],
    permissions: { creates: true, updates: true, deletes: true },
    actions: [],
  }
  await request(app)
    .get(ApiPathBuilder().sheetOnePath({ sheetName: IAM_USER_SHEET }))
    .set(...authHeader)
    .expect(200, expected)
})

it('should succeed to get IAMUser entities', async () => {
  await request(app)
    .get(ApiPathBuilder().entitiesPath({ sheetName: IAM_USER_SHEET }))
    .set(...authHeader)
    .expect(200)
    .then((resp) => {
      expect(resp.body).toMatchObject({
        total: 2,
      })
    })
})

it('should fail to get IAMUser entities with invalid queries', async () => {
  await request(app)
    .get(
      ApiPathBuilder().entitiesPath({ sheetName: IAM_USER_SHEET }) +
        '?' +
        qs.stringify({
          limit: 10,
          page: -1,
        }),
    )
    .set(...authHeader)
    .expect(400)
    .then((resp) => {
      expect(resp.body).toHaveProperty(['error', 'message'])
    })
})

it('should be able to create IAMUser', async () => {
  const user = {
    name: 'new user',
    email: 'new@example.com',
    roles: ['admin'],
  }
  const created = await request(app)
    .post(ApiPathBuilder().entitiesPath({ sheetName: IAM_USER_SHEET }))
    .send(user)
    .set(...authHeader)
    .expect(200)
    .then((resp) => resp.body as EntityBase)
  expect(created).toMatchObject(user)

  await request(app)
    .get(
      ApiPathBuilder().entityOnePath({
        sheetName: IAM_USER_SHEET,
        entityId: created.id,
      }),
    )
    .set(...authHeader)
    .expect(200)
    .then((resp) => {
      expect(resp.body).toEqual(created)
    })
})

it('should drop unnecessary field on creating IAMUser', async () => {
  const user = {
    name: 'new user 2',
    email: 'new2@example.com',
    roles: [DefaultIAMRoles.DEFAULT_ROLE],
    expectToBeDropped: 100,
  }
  const created = await request(app)
    .post(ApiPathBuilder().entitiesPath({ sheetName: IAM_USER_SHEET }))
    .send(user)
    .set(...authHeader)
    .expect(200)
    .then((resp) => resp.body as EntityBase)
  expect(created).not.toHaveProperty('expectToBeDropped')
})

it('should fail to create IAMUser with invalid input', async () => {
  const user = {
    name: 'new user 2',
    email: 'invalid_email',
    roles: ['invalid_role'],
  }
  await request(app)
    .post(ApiPathBuilder().entitiesPath({ sheetName: IAM_USER_SHEET }))
    .send(user)
    .set(...authHeader)
    .expect(422)
    .then((resp) => {
      expect(resp.body).toHaveProperty(['errors', '0', 'message'])
      expect(resp.body).toHaveProperty(['errors', '0', 'field'])
      expect(resp.body).toHaveProperty(['errors', '1', 'message'])
      expect(resp.body).toHaveProperty(['errors', '1', 'field'])
    })
})

it('should succeed to update IAMUser', async () => {
  const user = {
    name: 'new user 3',
    email: 'new3@example.com',
    roles: [DefaultIAMRoles.DEFAULT_ROLE],
  }
  const created = await request(app)
    .post(ApiPathBuilder().entitiesPath({ sheetName: IAM_USER_SHEET }))
    .send(user)
    .set(...authHeader)
    .expect(200)
    .then((resp) => resp.body as EntityBase)

  await request(app)
    .post(
      ApiPathBuilder().entityOnePath({
        sheetName: IAM_USER_SHEET,
        entityId: created.id,
      }),
    )
    .send({
      email: 'updated@example.com',
      roles: [DefaultIAMRoles.ADMIN_ROLE],
    })
    .set(...authHeader)
    .expect(200)

  await request(app)
    .get(
      ApiPathBuilder().entityOnePath({
        sheetName: IAM_USER_SHEET,
        entityId: created.id,
      }),
    )
    .set(...authHeader)
    .expect(200)
    .then((resp) => {
      expect(resp.body).toMatchObject({
        ...user,
        email: 'updated@example.com',
        roles: [DefaultIAMRoles.ADMIN_ROLE],
      })
    })
})

it('should be able to delete IAMUser', async () => {
  const user = {
    name: 'new user 4',
    email: 'new4@example.com',
    roles: [DefaultIAMRoles.DEFAULT_ROLE],
  }
  const created = await request(app)
    .post(ApiPathBuilder().entitiesPath({ sheetName: IAM_USER_SHEET }))
    .send(user)
    .set(...authHeader)
    .expect(200)
    .then((resp) => resp.body as EntityBase)

  // check to be created
  await request(app)
    .get(
      ApiPathBuilder().entityOnePath({
        sheetName: IAM_USER_SHEET,
        entityId: created.id,
      }),
    )
    .set(...authHeader)
    .expect(200)

  await request(app)
    .post(
      ApiPathBuilder().entitiesDeletePath({
        sheetName: IAM_USER_SHEET,
      }),
    )
    .send({
      ids: [created.id],
    })
    .set(...authHeader)
    .expect(200)

  // check to be deleted
  await request(app)
    .get(
      ApiPathBuilder().entityOnePath({
        sheetName: IAM_USER_SHEET,
        entityId: created.id,
      }),
    )
    .set(...authHeader)
    .expect(404)
})