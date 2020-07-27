import { SortQuery } from '@sheeted/core'
import { ListQuery } from '@sheeted/core/build/web/Shared.type'

import {
  SortBuilder,
  SortOrders,
} from '../../../src/controllers/concern/SortBuilder'

test('SortBuilder', () => {
  const build = (
    defaultSort: SortQuery<any> | undefined,
    sort: ListQuery['sort'],
  ) =>
    new SortBuilder({
      Schema: {
        // Just use field names
        key1: null,
      },
      View: {
        defaultSort,
      },
    } as any).build(sort)

  {
    const defaultSort = undefined
    const sort: ListQuery['sort'] = []
    expect(build(defaultSort, sort)).toEqual([
      {
        field: 'updatedAt',
        order: 'desc',
      },
    ])
  }

  {
    const defaultSort = undefined
    const sort = [
      {
        field: 'keyNotFound',
        order: SortOrders.ASC,
      },
      {
        field: 'keyNotFound2',
        order: SortOrders.DESC,
      },
    ]
    expect(build(defaultSort, sort)).toEqual([
      {
        field: 'updatedAt',
        order: 'desc',
      },
    ])
  }

  {
    const defaultSort = {
      field: 'key1',
      order: SortOrders.DESC,
    }
    const sort: ListQuery['sort'] = []
    expect(build(defaultSort, sort)).toEqual([
      {
        field: 'key1',
        order: 'desc',
      },
      {
        field: 'updatedAt',
        order: 'desc',
      },
    ])
  }

  {
    const defaultSort = {
      field: 'key1',
      order: SortOrders.DESC,
    } as const
    const sort = [
      {
        field: 'key1',
        order: SortOrders.ASC,
      },
    ]
    expect(build(defaultSort, sort)).toEqual([
      {
        field: 'key1',
        order: 'asc',
      },
      {
        field: 'updatedAt',
        order: 'desc',
      },
    ])
  }

  {
    const defaultSort = {
      field: 'key1',
      order: SortOrders.DESC,
    }
    const sort = [
      {
        field: 'updatedAt',
        order: SortOrders.ASC,
      },
    ]
    expect(build(defaultSort, sort)).toEqual([
      {
        field: 'updatedAt',
        order: 'asc',
      },
      {
        field: 'key1',
        order: 'desc',
      },
    ])
  }
})
