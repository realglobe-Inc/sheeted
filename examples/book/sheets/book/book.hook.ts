import { Hook } from '@sheeted/core'
import { IAMUserModel } from '@sheeted/mongoose'

import { BookEntity } from './book.entity'
import { BookModel } from './book.model'

export const BookHook: Hook<BookEntity> = {
  async onCreate(book, ctx) {
    const user = (await IAMUserModel.findOne({ id: ctx.user.id }))!.toObject()
    await BookModel.updateOne(
      { id: book.id },
      {
        buyer: user,
      },
    )
  },
}
