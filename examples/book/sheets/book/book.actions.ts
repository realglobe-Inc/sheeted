import { Action } from '@sheeted/core'

import { ActionIds } from '../../constants'

import { BookEntity } from './book.entity'
import { BookRepository } from './book.repository'

export const BookActions: Action<BookEntity>[] = [
  {
    id: ActionIds.LIKE,
    title: 'Increment like count',
    icon: 'exposure_plus_1',
    perform: async (entity: BookEntity): Promise<void> => {
      await BookRepository.update(entity.id, {
        like: entity.like + 1,
      })
    },
  },
]
