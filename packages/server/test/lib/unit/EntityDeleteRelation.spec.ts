import { Types, Schema } from '@sheeted/core'

import {
  createEntityDeleteRelation,
  EntityDeleteRelationEdge,
} from '../../../src/controllers/concern/EntityDeleteRelation'

test('EntityDeleteRelation.ts', () => {
  expect(createEntityDeleteRelation([])).toEqual(new Map())

  expect(
    createEntityDeleteRelation([
      {
        name: 'A',
        Schema: {
          b: {
            type: Types.Entity,
            entityProperties: {
              sheetName: 'B',
              onDelete: 'CASCADE',
            },
          },
          c: {
            type: Types.Entity,
            entityProperties: {
              sheetName: 'C',
              onDelete: 'SET_NULL',
            },
          },
        } as Schema,
      } as any,
      {
        name: 'B',
        Schema: {
          c: {
            type: Types.Entity,
            entityProperties: {
              sheetName: 'C',
              onDelete: 'RESRICT',
            },
          },
        } as Schema,
      } as any,
      {
        name: 'C',
        Schema: {
          text: {
            type: Types.Text,
          },
        },
      },
      {
        name: 'D',
        Schema: {
          c: {
            type: Types.Entity,
            entityProperties: {
              sheetName: 'C',
              // default delete option
            },
          },
        },
      },
    ]),
  ).toEqual(
    new Map<string, EntityDeleteRelationEdge[]>([
      [
        'B',
        [
          {
            referrer: {
              sheetName: 'A',
              field: 'b',
            },
            refered: {
              sheetName: 'B',
            },
            onDelete: 'CASCADE',
          },
        ],
      ],
      [
        'C',
        [
          {
            referrer: { sheetName: 'A', field: 'c' },
            refered: {
              sheetName: 'C',
            },
            onDelete: 'SET_NULL',
          },
          {
            referrer: { sheetName: 'B', field: 'c' },
            refered: {
              sheetName: 'C',
            },
            onDelete: 'RESRICT',
          },
          {
            referrer: { sheetName: 'D', field: 'c' },
            refered: {
              sheetName: 'C',
            },
            onDelete: 'RESRICT',
          },
        ],
      ],
    ]),
  )
})
