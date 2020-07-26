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

const DEFAULT_ON_DELETE = 'RESRICT' as const

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
