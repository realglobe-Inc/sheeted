import { SortBuilder } from '../../../src/controllers/concern/SortBuilder'

test('SortBuilder', () => {
  expect(
    new SortBuilder({
      Schema: {
        // only key names are used
        key1: null,
      },
      View: {
        defaultSort: undefined,
      },
    } as any).build([]),
  ).toEqual([
    {
      field: 'updatedAt',
      order: 'desc',
    },
  ])

  expect(
    new SortBuilder({
      Schema: {
        key1: null,
      },
      View: {
        defaultSort: {
          field: 'key1',
          order: 'desc',
        },
      },
    } as any).build([]),
  ).toEqual([
    {
      field: 'key1',
      order: 'desc',
    },
  ])

  expect(
    new SortBuilder({
      Schema: {
        key1: null,
      },
      View: {
        defaultSort: {
          field: 'key1',
          order: 'desc',
        },
      },
    } as any).build([
      {
        field: 'key1',
        order: 'asc',
      },
    ]),
  ).toEqual([
    {
      field: 'key1',
      order: 'asc',
    },
    {
      field: 'updatedAt',
      order: 'desc',
    },
  ])
})
