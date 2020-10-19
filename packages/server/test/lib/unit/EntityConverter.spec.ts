import { Schema, Types, AccessPolicy, EntityBase } from '@sheeted/core'
import { ENTITY_META_FIELD } from '@sheeted/core/build/web/Consts'

import { EntityConverter } from '../../../src/controllers/concern/EntityConverter'
import { UserAccessPolicy } from '../../../src/controllers/concern/UserAccessPolicy'

test('EntityConverter.spec.ts', () => {
  const SHEET_NAME = 'sheet'
  type Entity = EntityBase & {
    time: number
    sub?: EntityBase & {
      time: number
    }
  }
  const schema: Schema<Entity> = {
    time: {
      type: Types.Time,
    },
    sub: {
      type: Types.Entity,
      optional: true,
      entityProperties: {
        sheetName: 'sheet',
      },
    },
  }
  const schemas = new Map<string, Schema>([[SHEET_NAME, schema]])
  const accessPolicies: AccessPolicy[] = [
    {
      action: 'read',
      role: 'default',
      column: {
        effect: 'deny',
        columns: ['excluded'],
      },
    },
    {
      action: 'update',
      role: 'default',
    },
    {
      action: 'custom',
      role: 'default',
      customActionId: 'approve',
    },
    {
      action: 'custom',
      role: 'default',
      customActionId: 'reject',
      condition: () => false,
    },
  ]
  const userAccessPolicy = new UserAccessPolicy(['default'], accessPolicies, [
    'time',
    'excluded',
  ])
  const converter = new EntityConverter(
    SHEET_NAME,
    schemas,
    userAccessPolicy,
    {},
    { user: null as any },
  )
  const permissions = {
    deletes: false,
    updates: true,
    customActions: {
      approve: true,
      reject: false,
    },
  }

  expect(
    converter.beforeSend({
      id: '00000000',
      time: 100,
      excluded: 'foo',
    }),
  ).toEqual({
    id: '00000000',
    time: '01:40',
    [ENTITY_META_FIELD]: {
      displayText: '00000000',
      permissions,
    },
  })

  expect(
    converter.beforeSave({
      id: '00000000',
      time: '01:23',
      [ENTITY_META_FIELD]: {
        displayText: '00000000',
        permissions,
      },
    }),
  ).toEqual({
    id: '00000000',
    time: 83,
  })

  expect(
    converter.beforeSend({
      id: '00000001',
      time: 100,
      sub: {
        id: '00000002',
        time: 100,
      },
    }),
  ).toEqual({
    id: '00000001',
    time: '01:40',
    sub: {
      id: '00000002',
      time: '01:40',
      [ENTITY_META_FIELD]: {
        displayText: '00000002',
        permissions,
      },
    },
    [ENTITY_META_FIELD]: {
      displayText: '00000001',
      permissions,
    },
  })
})
