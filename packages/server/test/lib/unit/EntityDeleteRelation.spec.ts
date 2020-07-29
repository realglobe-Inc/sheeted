import { Types, Schema } from '@sheeted/core'

import {
  createEntityDeleteRelation,
  EntityDeleteRelationEdge,
  validateEntityDeleteRelation,
} from '../../../src/controllers/concern/EntityDeleteRelation'

test('EntityDeleteRelation / create', () => {
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

test('EntityDeleteRelation / validate', () => {
  const sheetsFrom = (edges: string[][]): any[] => {
    const flat = (arr: string[][]): string[] => ([] as string[]).concat(...arr)
    const uniq = (arr: string[]) => Array.from(new Set(arr))
    const sheetNames = uniq(flat(edges))
    const sheets = sheetNames.map((sheetName) => ({
      name: sheetName,
      Schema: edges
        .filter(([referrer]) => referrer === sheetName)
        .map(
          ([, sheetName]) =>
            [
              sheetName,
              {
                type: Types.Entity,
                entityProperties: {
                  sheetName,
                },
              },
            ] as const,
        )
        .reduce(
          (schema, [sheetName, field]) => ({
            ...schema,
            [sheetName]: field,
          }),
          {},
        ),
    }))
    return sheets
  }
  {
    const relation = createEntityDeleteRelation(
      sheetsFrom([
        ['A', 'B'],
        ['B', 'C'],
        ['C', 'D'],
      ]),
    )
    expect(validateEntityDeleteRelation(relation)).toHaveLength(0)
  }
  {
    const relation = createEntityDeleteRelation(
      sheetsFrom([
        ['A', 'B'],
        ['B', 'C'],
        ['C', 'D'],
        ['A', 'C'],
        ['B', 'D'],
      ]),
    )
    expect(validateEntityDeleteRelation(relation)).toHaveLength(0)
  }
  {
    const relation = createEntityDeleteRelation(
      sheetsFrom([
        ['A', 'B'],
        ['B', 'C'],
        ['C', 'D'],
        ['D', 'B'],
      ]),
    )
    expect(validateEntityDeleteRelation(relation)).toHaveLength(1)
  }
  {
    const relation = createEntityDeleteRelation(
      sheetsFrom([
        ['A', 'B'],
        ['B', 'C'],
        ['C', 'D'],
        ['A', 'C'],
        ['D', 'A'],
      ]),
    )
    expect(validateEntityDeleteRelation(relation)).toHaveLength(1)
  }
})
