import { EntityBase, Repositories } from '@sheeted/core'

import { IterableFinder } from './RepositoryHelper'
import { EntityDeleteRelation } from './EntityDeleteRelation'

export class RestrictViolationError extends Error {}

export type RelatedEntitiesResult = {
  delete: {
    [sheetName: string]: string[] // ids
  }
  update: {
    sheetName: string
    ids: string[]
    changes: any
  }[]
}

class Result {
  value: RelatedEntitiesResult = {
    delete: {},
    update: [],
  }

  merge(another: RelatedEntitiesResult): void {
    for (const [sheetName, ids] of Object.entries(another.delete)) {
      this.pushDelete(sheetName, ids)
    }
    for (const { sheetName, ids, changes } of another.update) {
      this.pushUpdate(sheetName, ids, changes)
    }
  }

  pushDelete(sheetName: string, ids: string[]): void {
    const uniq = (arr: string[]): string[] => Array.from(new Set(arr))
    this.value.delete[sheetName] = uniq(
      (this.value.delete[sheetName] || []).concat(ids),
    )
  }

  pushUpdate(sheetName: string, ids: string[], changes: any): void {
    this.value.update = this.value.update.concat({
      sheetName,
      ids,
      changes,
    })
  }
}

export class RelatedEntityFinder {
  constructor(
    private readonly relation: EntityDeleteRelation,
    private readonly repositories: Repositories,
  ) {}

  async find(
    sheetName: string,
    entity: EntityBase,
  ): Promise<RelatedEntitiesResult> {
    const { relation, repositories } = this
    const edges = relation.get(sheetName) || []
    const result = new Result()
    for (const edge of edges) {
      const { referrer, onDelete } = edge
      const repository = repositories.get<EntityBase>(referrer.sheetName)
      const find = IterableFinder(
        repositories.get<EntityBase>(referrer.sheetName),
      )
      switch (onDelete) {
        case 'CASCADE': {
          let ids: string[] = []
          for await (const entities of find({
            [referrer.field]: entity,
          })) {
            ids = ids.concat(entities.map((e) => e.id))
            // Find resursively
            for (const entity of entities) {
              const subResult = await this.find(referrer.sheetName, entity)
              result.merge(subResult)
            }
          }
          result.pushDelete(referrer.sheetName, ids)
          break
        }
        case 'RESTRICT': {
          const list = await repository.find({
            page: 1,
            limit: 1,
            filter: {
              [referrer.field]: entity,
            },
            sort: [],
          })
          if (list.total > 0) {
            throw new RestrictViolationError()
          }
          break
        }
        case 'SET_NULL': {
          let ids: string[] = []
          for await (const entities of find({
            [referrer.field]: entity,
          })) {
            ids = ids.concat(entities.map((e) => e.id))
          }
          result.pushUpdate(referrer.sheetName, ids, { [referrer.field]: null })
          break
        }
      }
    }
    return result.value
  }
}
