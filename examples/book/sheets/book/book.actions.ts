import { Action } from '@sheeted/core'

import { ActionIds } from '../../constants'

import { BookEntity } from './book.entity'
import { BookModel } from './book.model'

export const BookActions: Action<BookEntity>[] = [
  {
    id: ActionIds.LIKE,
    title: 'Increment like count',
    icon: 'exposure_plus_1',
    perform: async (entity: BookEntity): Promise<void> => {
      await BookModel.updateOne(
        {
          id: entity.id,
        },
        {
          $inc: {
            like: 1,
          },
        },
      )
    },
  },
]
