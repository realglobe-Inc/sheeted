import { Types } from '@sheeted/core'

import {
  validateSheet,
  validateSheets,
} from '../../../src/server/SheetValidator'

test('SheetValidator.validateSheet()', () => {
  expect(
    validateSheet({
      name: 'a',
      Schema: {},
      Model: null as any,
      Validator: null as any,
      View: {
        title: 'a',
        display: () => '',
        columns: {},
      },
      AccessPolicies: [],
    }),
  ).toHaveLength(0)

  expect(
    validateSheet({
      name: 'a',
      Schema: {
        enum: {
          type: Types.Enum,
          // enumProperties is required
        },
        enumList: {
          type: Types.EnumList,
          // enumProperties is required
        },
        entity: {
          type: Types.Entity,
          // entityProperties is required
        },
      },
      Model: null as any,
      Validator: null as any,
      View: {
        title: 'a',
        display: () => '',
        columns: {
          enum: {
            title: 'enum',
            // enumLabels is required.
          },
          enumList: {
            title: 'enumList',
            // enumLabels is required.
          },
        },
      },
      AccessPolicies: [],
    }),
  ).toHaveLength(5)
})

test('SheetValidator.validateSheets()', () => {
  expect(() =>
    validateSheets([
      {
        name: 'duplicate',
        Schema: {},
        Model: null as any,
        Validator: null as any,
        View: null as any,
        AccessPolicies: [],
      },
      {
        name: 'duplicate',
        Schema: {},
        Model: null as any,
        Validator: null as any,
        View: null as any,
        AccessPolicies: [],
      },
    ]),
  ).toThrow()
})
