import { Types } from '@sheeted/core'

import {
  createEntityDeleteRelation,
  EntityDeleteRelationEdge,
  validateEntityDeleteRelation,
} from '../../../src/controllers/concern/EntityDeleteRelation'

const sheetsFrom = (edges: string[][]): any[] => {
  const flat = (arr: string[][]): string[] => ([] as string[]).concat(...arr)
  const uniq = (arr: string[]) => Array.from(new Set(arr))
  const sheetNames = uniq(flat(edges.map((edge) => edge.slice(0, 2))))
  const sheets = sheetNames.map((sheetName) => ({
    name: sheetName,
    Schema: edges
      .filter(([referrer]) => referrer === sheetName)
      .map(
        ([, sheetName, onDelete]) =>
          [
            sheetName.toLowerCase(),
            {
              type: Types.Entity,
              entityProperties: {
                sheetName,
                onDelete,
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

test('EntityDeleteRelation / create', () => {
  expect(createEntityDeleteRelation([])).toEqual(new Map())

  expect(
    createEntityDeleteRelation(
      sheetsFrom([
        ['A', 'B', 'CASCADE'],
        ['A', 'C', 'SET_NULL'],
        ['B', 'C', 'RESTRICT'],
        ['D', 'C'],
      ]),
    ),
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
            onDelete: 'RESTRICT',
          },
          {
            referrer: { sheetName: 'D', field: 'c' },
            refered: {
              sheetName: 'C',
            },
            onDelete: 'RESTRICT',
          },
        ],
      ],
    ]),
  )
})

test('EntityDeleteRelation / validate', () => {
  {
    const relation = createEntityDeleteRelation(
      sheetsFrom([
        ['A', 'B'],
        ['B', 'C'],
        ['C', 'D'],
      ]),
    )
    expect(validateEntityDeleteRelation(relation)).toBeFalsy()
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
    expect(validateEntityDeleteRelation(relation)).toBeFalsy()
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
    expect(validateEntityDeleteRelation(relation)).toBeTruthy()
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
    expect(validateEntityDeleteRelation(relation)).toBeTruthy()
  }
})
