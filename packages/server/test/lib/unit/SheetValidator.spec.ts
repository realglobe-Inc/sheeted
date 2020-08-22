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
      Validator: null as any,
      View: {
        title: 'a',
        display: () => '',
        columns: [],
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
          // unique is not allowed
          unique: true,
        },
        entity: {
          type: Types.Entity,
          // entityProperties is required
        },
        entityOptional: {
          type: Types.Entity,
          // optional is required
          entityProperties: {
            sheetName: 'b',
            onDelete: 'SET_NULL',
          },
        },
        detailPage: {
          type: Types.Text,
          // readonly is required
        },
      },
      Validator: null as any,
      View: {
        title: 'a',
        display: () => '',
        columns: [
          {
            field: 'enum',
            title: 'enum',
            // enumLabels is required.
          },
          {
            field: 'enumList',
            title: 'enumList',
            // enumLabels is required.
          },
          {
            field: 'detailPage',
            title: 'detailPage',
            detailPageOnly: true,
          },
        ],
      },
      AccessPolicies: [],
    }),
  ).toHaveLength(8)
})

test('SheetValidator.validateSheets()', () => {
  expect(() =>
    validateSheets([
      {
        name: 'duplicate',
        Schema: {},
        Validator: null as any,
        View: null as any,
        AccessPolicies: [],
      },
      {
        name: 'duplicate',
        Schema: {},
        Validator: null as any,
        View: null as any,
        AccessPolicies: [],
      },
    ]),
  ).toThrow()
})
