import { Repositories, Schema, typeEquals, Types } from '@sheeted/core'

import { EntityConverter } from './EntityConverter'

export class FilterBuilder {
  constructor(
    private readonly schema: Schema,
    private readonly repositories: Repositories,
    private readonly converter: EntityConverter,
    private readonly defaultFilter: Record<string, any> = {},
  ) {}

  async build(filter: Record<string, any>): Promise<any> {
    const { schema, repositories, converter, defaultFilter } = this
    const built = {
      ...converter.beforeSave(filter),
      ...defaultFilter,
    }
    // entity type は id から entity に変換する
    const entityFields = Object.entries(schema).filter(([, field]) =>
      typeEquals(field.type, Types.Entity),
    )
    for (const [key, field] of entityFields) {
      if (built[key]) {
        const id = built[key]
        const repository = repositories.get<any>(
          field.entityProperties!.sheetName,
        )
        built[key] = await repository.findById(id)
      }
    }
    return built
  }
}
