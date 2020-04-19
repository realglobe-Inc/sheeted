import React from 'react'
import {
  Column as SColumn,
  WithEntityMetaField,
} from '@sheeted/core/build/web/Shared.type'
import { Column as MColumn } from 'material-table'
import { ENTITY_META_FIELD } from '@sheeted/core/build/web/Consts'

import { ExternalLink } from '../../../components/ExternalLink'
import { EditCellFor } from '../components/EditCell'
import { Entity } from '../../../types/Entity.type'

class Renderer {
  constructor(private readonly column: SColumn) {}

  get render() {
    const { column } = this
    const isEnum = Boolean(column.enumColumnProperties)
    const isEntity = Boolean(column.entityColumnProperties)
    const isCustomText = Boolean(column.textColumnProperties)
    const isMultilineText = column.form === 'text-multiline'
    if (isEnum) {
      return this.renderEnum.bind(this)
    }
    if (isEntity) {
      return this.renderEntity.bind(this)
    }
    if (isCustomText) {
      return this.renderCustomText.bind(this)
    }
    if (isMultilineText) {
      return this.renderMultilineText.bind(this)
    }
    return undefined
  }

  renderCustomText(entity: any) {
    if (!entity) {
      return ''
    }
    const { column } = this
    const rawValue = (entity[column.field] || '') as string
    if (column.textColumnProperties?.isLink) {
      return (
        <ExternalLink href={rawValue} target="_blank" rel="noopener noreferrer">
          {rawValue}
        </ExternalLink>
      )
    }
    return rawValue
  }

  renderMultilineText(entity: any) {
    if (!entity) {
      return ''
    }
    const { column } = this
    const rawValue = (entity[column.field] || '') as string
    return (
      <div>
        {rawValue.split('\n').map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    )
  }

  renderEnum(entity: any): string {
    if (!entity) {
      return ''
    }
    const { column } = this
    const rawValue = entity[column.field]
    const values: string[] = Array.isArray(rawValue)
      ? rawValue
      : [rawValue].filter(Boolean)
    return values
      .map((value) => {
        const label = column.enumColumnProperties!.labels.find(
          (l) => l.value === value,
        )
        return label ? label.label : value
      })
      .sort()
      .join(', ')
  }

  renderEntity(entity: any): string {
    if (!entity) {
      return ''
    }
    const { column } = this
    const rawValue = entity[column.field] as WithEntityMetaField
    return rawValue ? rawValue[ENTITY_META_FIELD].displayText : ''
  }
}

export const convertColumn = (column: SColumn): MColumn<Entity> => {
  const editComponent = EditCellFor(column)
  const { readonly, readonlyOnCreate, readonlyOnUpdate } = column
  const editable = readonly
    ? 'never'
    : readonlyOnCreate && readonlyOnUpdate
    ? 'never'
    : readonlyOnCreate
    ? 'onUpdate'
    : readonlyOnUpdate
    ? 'onAdd'
    : 'always'
  return {
    field: column.field,
    title: column.title,
    editable,
    editComponent,
    render: new Renderer(column).render,
  }
}
