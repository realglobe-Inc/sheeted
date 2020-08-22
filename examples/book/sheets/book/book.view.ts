import { View } from '@sheeted/core'
import { CALENDAR_DATETIME_FORMAT } from '@sheeted/core/build/interceptors'

import { BookEntity } from './book.entity'

export const BookView: View<BookEntity> = {
  title: 'Books',
  icon: 'menu_book',
  display: (entity) => entity.title,
  enableDetail: true,
  defaultSort: {
    field: 'title',
    order: 'asc',
  },
  columns: [
    { field: 'title', title: 'TITLE', style: { minWidth: '10em' } },
    { field: 'like', title: 'LIKE' },
    {
      field: 'price',
      title: 'PRICE',
      numericOptions: {
        formatWithIntl: {
          locales: 'ja-JP',
          options: { style: 'currency', currency: 'JPY' },
        },
      },
    },
    {
      field: 'genre',
      title: 'GENRE',
      enumLabels: { comic: 'COMIC', novel: 'NOVEL' },
    },
    {
      field: 'formats',
      title: 'FORMATS',
      enumLabels: { paper: 'PAPER', kindle: 'KINDLE' },
    },
    { field: 'url', title: 'URL', textOptions: { isLink: true } },
    { field: 'buyer', title: 'BUYER' },
    { field: 'buyDate', title: 'BUY DATE' },
    { field: 'readFinishedAt', title: 'FINISHED READING' },
    { field: 'readMinutes', title: 'READ TIME' },
    { field: 'publicationYear', title: 'YEAR OF PUBLICATION' },
    { field: 'comment', title: 'COMMENT', style: { minWidth: '15em' } },
    {
      field: 'updatedAt',
      title: 'LAST UPDATED',
      numericOptions: { formatAsDate: CALENDAR_DATETIME_FORMAT },
    },
  ],
}
