import { Schema, Types, typeEquals, Type, SearchQuery } from '@sheeted/core'

export class SearchBuilder {
  constructor(private readonly schema: Schema) {}

  build(search: string): SearchQuery<any> | undefined {
    const { schema } = this
    const searchFields = Object.keys(schema).filter((field) =>
      [Types.Text, Types.LongText].some((type) =>
        typeEquals(type, schema[field]?.type || ({} as Type<any>)),
      ),
    )
    const words = search.split(/\s/).filter(Boolean)
    const searchQuery =
      searchFields.length > 0 && words.length > 0
        ? { fields: searchFields, words }
        : undefined
    return searchQuery
  }
}
