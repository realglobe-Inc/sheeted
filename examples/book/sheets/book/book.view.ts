import { View } from '@sheeted/core'

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
  columns: {
    title: {
      title: 'TITLE',
      style: {
        minWidth: '10em',
      },
    },
    like: {
      title: 'LIKE',
    },
    price: {
      title: 'PRICE',
      numericOptions: {
        formatWithIntl: {
          locales: 'ja-JP',
          options: {
            style: 'currency',
            currency: 'JPY',
          },
        },
      },
    },
    genre: {
      title: 'GENRE',
      enumLabels: {
        comic: 'COMIC',
        novel: 'NOVEL',
      },
    },
    formats: {
      title: 'FORMATS',
      enumLabels: {
        paper: 'PAPER',
        kindle: 'KINDLE',
      },
    },
    url: {
      title: 'URL',
      textOptions: {
        isLink: true,
      },
    },
    buyer: {
      title: 'BUYER',
    },
    buyDate: {
      title: 'BUY DATE',
    },
    readFinishedAt: {
      title: 'FINISHED READING',
    },
    readMinutes: {
      title: 'READ TIME',
    },
    publicationYear: {
      title: 'YEAR OF PUBLICATION',
    },
    comment: {
      title: 'COMMENT',
      style: {
        minWidth: '15em',
      },
    },
  },
}
