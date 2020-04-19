import { Schema, Types, AccessPolicy } from '@sheeted/core'
import { ENTITY_META_FIELD } from '@sheeted/core/build/web/Consts'

import { EntityConverter } from '../../../src/controllers/concern/EntityConverter'
import { UserAccessPolicy } from '../../../src/controllers/concern/UserAccessPolicy'

test('EntityConverter.spec.ts', () => {
  type Entity = {
    time: number
  }
  const schema: Schema<Entity> = {
    time: {
      type: Types.Time,
    },
  }
  const accessPolicies: AccessPolicy[] = [
    {
      action: 'read',
      role: 'default',
      excludeColumns: ['excluded'],
    },
    {
      action: 'update',
      role: 'default',
    },
  ]
  const userAccessPolicy = new UserAccessPolicy(['default'], accessPolicies)
  const converter = new EntityConverter('sheet', schema, userAccessPolicy, {})
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
      permissions: { deletes: false, updates: true },
    },
  })

  expect(
    converter.beforeSave({
      id: '00000000',
      time: '01:23',
      [ENTITY_META_FIELD]: {
        displayText: '00000000',
        permissions: { deletes: false, updates: true },
      },
    }),
  ).toEqual({
    id: '00000000',
    time: 83,
  })
})
