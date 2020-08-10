import React, { FC } from 'react'
import dayjs from 'dayjs'
import {
  Column,
  WithEntityMetaField,
} from '@sheeted/core/build/web/Shared.type'
import { ENTITY_META_FIELD } from '@sheeted/core/build/web/Consts'
import Button from '@material-ui/core/Button'
import LaunchIcon from '@material-ui/icons/Launch'

import { ExternalLink } from '../components/ExternalLink'
import { InternalLink } from '../components/InternalLink'
import { useUIPaths } from '../hooks/UIPathHook'

type FieldValueProps = {
  entity?: Record<string, any>
}

const PlainValueHoc = (column: Column): FC<FieldValueProps> => {
  return function PlainValue({ entity }: FieldValueProps) {
    if (!entity) {
      return null
    }
    const rawValue = (entity[column.field] || '') as string
    return <div style={column.style}>{rawValue}</div>
  }
}

const LinkTextValueHoc = (column: Column): FC<FieldValueProps> => {
  return function LinkTextValue({ entity }: FieldValueProps) {
    if (!entity) {
      return null
    }
    const rawValue = (entity[column.field] || '') as string
    return (
      <ExternalLink
        href={rawValue}
        target="_blank"
        rel="noopener noreferrer"
        style={column.style}
      >
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
      <div style={column.style}>
        {rawValue.split('\n').map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    )
  }
}

const NumericValueHoc = (column: Column): FC<FieldValueProps> => {
  return function NumericValue({ entity }: FieldValueProps) {
    if (!entity || !entity[column.field]) {
      return null
    }
    const rawValue = Number(entity[column.field])
    const formatWithIntl = column.custom.numeric?.formatWithIntl
    const formatAsDate = column.custom.numeric?.formatAsDate
    const value = formatWithIntl
      ? new Intl.NumberFormat(
          formatWithIntl.locales,
          formatWithIntl.options,
        ).format(rawValue)
      : formatAsDate
      ? dayjs(rawValue).format(formatAsDate)
      : rawValue
    return <div style={column.style}>{value}</div>
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
      <div style={column.style}>
        {values
          .map((value) => {
            const label = column.custom.enum?.labels.find(
              (l) => l.value === value,
            )
            return label ? label.label : value
          })
          .sort()
          .join(', ')}
      </div>
    )
  }
}

const EntityValueHoc = (column: Column): FC<FieldValueProps> => {
  return function EntityValue({ entity }: FieldValueProps) {
    const { entityDetailPath } = useUIPaths()
    if (!entity) {
      return null
    }
    const rawValue = entity[column.field] as WithEntityMetaField & {
      id?: string
    }
    const path = entityDetailPath({
      sheetName: column.custom?.entity?.sheetName || '',
      entityId: rawValue?.id || '',
    })
    return (
      <div style={column.style}>
        {rawValue ? (
          <Button
            component={InternalLink}
            to={path}
            endIcon={<LaunchIcon fontSize="small" />}
            color="primary"
          >
            {rawValue[ENTITY_META_FIELD].displayText}
          </Button>
        ) : (
          ''
        )}
      </div>
    )
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
