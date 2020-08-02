import { EntityOnDeleteOption, Sheet } from '@sheeted/core'

export type EntityDeleteRelationEdge = {
  referrer: {
    sheetName: string
    field: string
  }
  refered: {
    sheetName: string
  }
  onDelete: EntityOnDeleteOption
}

export type EntityDeleteRelation = Map<string, EntityDeleteRelationEdge[]>

const DEFAULT_ON_DELETE = 'RESTRICT' as const

export const createEntityDeleteRelation = (
  sheets: Sheet[],
): EntityDeleteRelation => {
  const edges: EntityDeleteRelationEdge[] = sheets.flatMap((sheet) =>
    Object.entries(sheet.Schema)
      .filter(([, { entityProperties }]) => Boolean(entityProperties))
      .map(([field, { entityProperties }]) => ({
        referrer: {
          sheetName: sheet.name,
          field,
        },
        refered: {
          sheetName: entityProperties!.sheetName,
        },
        onDelete: entityProperties!.onDelete || DEFAULT_ON_DELETE,
      })),
  )
  const map: EntityDeleteRelation = new Map()
  for (const edge of edges) {
    const key = edge.refered.sheetName
    const value = map.get(key) || []
    map.set(key, value.concat(edge))
  }
  return map
}

const findLoop = (relation: EntityDeleteRelation, start: string) => {
  const maxDepth = relation.size
  const dfs = (current: string, depth: number) => {
    if (depth > maxDepth) {
      return false
    }
    for (const edge of relation.get(current) || []) {
      const ok = dfs(edge.referrer.sheetName, depth + 1)
      if (!ok) {
        return false
      }
    }
    return true
  }
  return dfs(start, 0)
}

export const validateEntityDeleteRelation = (
  relation: EntityDeleteRelation,
): Error | null => {
  const hasLoop = Array.from(relation.keys())
    .map((sheetName) => findLoop(relation, sheetName))
    .includes(false)
  return hasLoop
    ? new Error(
        'Detect loop in the relations of "entityProperties.onDelete" option',
      )
    : null
}
