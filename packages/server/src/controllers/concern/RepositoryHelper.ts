import { Repository } from '@sheeted/core'

/**
 * Find all entities using async iterator.
 */
export const IterableFinder = <E>(repository: Repository<E>, size = 100) => {
  return async function* find(filter: {
    [field: string]: any
  }): AsyncGenerator<E[]> {
    let page = 1
    let len = 0
    while (true) {
      const list = await repository.find({
        filter: filter as Partial<E>,
        page: page++,
        limit: size,
        sort: [],
      })
      len = list.entities.length
      if (len > 0) {
        yield list.entities
      } else {
        return
      }
    }
  }
}
