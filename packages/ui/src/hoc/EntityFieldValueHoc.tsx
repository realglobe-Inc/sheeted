import React, { FC } from 'react'
import {
  Column,
  WithEntityMetaField,
} from '@sheeted/core/build/web/Shared.type'
import { ENTITY_META_FIELD } from '@sheeted/core/build/web/Consts'

import { ExternalLink } from '../components/ExternalLink'

type FieldValueProps = {
  entity?: Record<string, any>
}

const PlainValueHoc = (column: Column): FC<FieldValueProps> => {
  return function PlainValue({ entity }: FieldValueProps) {
    if (!entity) {
      return null
    }
    const rawValue = (entity[column.field] || '') as string
    return <>{rawValue}</>
  }
}

const LinkTextValueHoc = (column: Column): FC<FieldValueProps> => {
  return function LinkTextValue({ entity }: FieldValueProps) {
    if (!entity) {
      return null
    }
    const rawValue = (entity[column.field] || '') as string
    return (
      <ExternalLink href={rawValue} target="_blank" rel="noopener noreferrer">
        {rawValue}
      </ExternalLink>
    )
  }
}

const MultilineTextValueHoc = (column: Column): FC<FieldValueProps> => {
  return function MultilineTextValue({ entity }: FieldValueProps) {
    if (!entity) {
      return null
    }
    const rawValue = (entity[column.field] || '') as string
    return (
      <div>
        {rawValue.split('\n').map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    )
  }
}

const NumericValueHoc = (column: Column): FC<FieldValueProps> => {
  return function NumericValue({ entity }: FieldValueProps) {
    if (!entity) {
      return null
    }
    const rawValue = (entity[column.field] || 0) as number
    const formatWithIntl = column.custom.numeric?.formatWithIntl
    const value = formatWithIntl
      ? new Intl.NumberFormat(
          formatWithIntl.locales,
          formatWithIntl.options,
        ).format(rawValue)
      : rawValue
    return <>{value}</>
  }
}

const EnumValueHoc = (column: Column): FC<FieldValueProps> => {
  return function EnumValue({ entity }: FieldValueProps) {
    if (!entity) {
      return null
    }
    const rawValue = entity[column.field]
    const values: string[] = Array.isArray(rawValue)
      ? rawValue
      : [rawValue].filter(Boolean)
    return (
      <>
        {values
          .map((value) => {
            const label = column.custom.enum?.labels.find(
              (l) => l.value === value,
            )
            return label ? label.label : value
          })
          .sort()
          .join(', ')}
      </>
    )
  }
}

const EntityValueHoc = (column: Column): FC<FieldValueProps> => {
  return function EntityValue({ entity }: FieldValueProps) {
    if (!entity) {
      return null
    }
    const rawValue = entity[column.field] as WithEntityMetaField
    return <>{rawValue ? rawValue[ENTITY_META_FIELD].displayText : ''}</>
  }
}

export const EntityFieldValueHoc = (column: Column): FC<FieldValueProps> => {
  const isEnum = Boolean(column.custom.enum)
  const isEntity = Boolean(column.custom.entity)
  const isLink = Boolean(column.custom.text?.isLink)
  const isMultilineText = column.form === 'text-multiline'
  const isNumeric = Boolean(column.custom.numeric)
  if (isEnum) {
    return EnumValueHoc(column)
  }
  if (isEntity) {
    return EntityValueHoc(column)
  }
  if (isLink) {
    return LinkTextValueHoc(column)
  }
  if (isMultilineText) {
    return MultilineTextValueHoc(column)
  }
  if (isNumeric) {
    return NumericValueHoc(column)
  }
  return PlainValueHoc(column)
}