import { View } from '@sheeted/core'

import { BookEntity } from './book.entity'

export const BookView: View<BookEntity> = {
  title: 'Books',
  display: (entity) => entity.title,
  // enableDetail: true,
  columns: {
    title: {
      title: 'TITLE',
    },
    like: {
      title: 'LIKE',
    },
    price: {
      title: 'PRICE',
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
    readMinutes: {
      title: 'READ TIME',
    },
    publicationYear: {
      title: 'YEAR OF PUBLICATION',
    },
    comment: {
      title: 'COMMENT',
    },
  },
}
