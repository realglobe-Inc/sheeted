import { Hook } from '@sheeted/core'
import { IAMUserModel } from '@sheeted/mongoose'

import { BookEntity } from './book.entity'
import { BookRepository } from './book.repository'

export const BookHook: Hook<BookEntity> = {
  async onCreate(book, ctx, options) {
    const user = (await IAMUserModel.findOne({ id: ctx.user.id }))!.toObject()
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
