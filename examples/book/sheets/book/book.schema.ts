import { Types, IAM_USER_SHEET, Schema } from '@sheeted/core'

import { Genres, Formats } from '../../constants'

import { BookEntity } from './book.entity'

export const BookSchema: Schema<BookEntity> = {
  title: {
    type: Types.Text,
    searchable: true,
    unique: true,
  },
  like: {
    type: Types.Numeric,
    readonly: true,
  },
  price: {
    type: Types.Numeric,
  },
  genre: {
    type: Types.Enum,
    enumProperties: {
      values: Genres,
    },
  },
  formats: {
    type: Types.EnumList,
    enumProperties: {
      values: Formats,
    },
  },
  url: {
    type: Types.Text,
    optional: true,
  },
  buyer: {
    type: Types.Entity,
    readonly: true,
    entityProperties: {
      sheetName: IAM_USER_SHEET,
    },
  },
  buyDate: {
    type: Types.CalendarDate,
  },
  readMinutes: {
    type: Types.Time,
  },
  publicationYear: {
    type: Types.CalendarYear,
  },
  comment: {
    type: Types.LongText,
    optional: true,
  },
}
