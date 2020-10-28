import { Hook } from '@sheeted/core'
import { IAMUserRepository } from '@sheeted/mongoose'

import { BookEntity } from './book.entity'
import { BookRepository } from './book.repository'

export const BookHook: Hook<BookEntity> = {
  async onCreate(book, ctx, options) {
    const user = await IAMUserRepository.findById(ctx.user.id)
    if (!user) {
      throw new Error(`user not found for id "${ctx.user.id}"`)
    }
    await BookRepository.update(
      book.id,
      {
        buyer: user,
      },
      {
        transaction: options.transaction,
      },
    )
  },
}
