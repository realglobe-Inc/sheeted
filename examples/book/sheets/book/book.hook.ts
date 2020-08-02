import { Hook } from '@sheeted/core'
import { IAMUserModel } from '@sheeted/mongoose'

import { BookEntity } from './book.entity'
import { BookModel } from './book.model'

export const BookHook: Hook<BookEntity> = {
  async onCreate(book, ctx, options) {
    const user = (await IAMUserModel.findOne({ id: ctx.user.id }))!.toObject()
    if (!user) {
      throw new Error(`user not found for id "${ctx.user.id}"`)
    }
    await BookModel.updateOne(
      { id: book.id },
      {
        buyer: user,
      },
      {
        session: options.transaction,
      },
    )
  },
}
