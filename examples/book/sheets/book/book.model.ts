import { compileModel } from '@sheeted/mongoose'

import { SheetNames } from '../../constants'

import { BookSchema } from './book.schema'
import { BookEntity } from './book.entity'

export const BookModel = compileModel<BookEntity>(SheetNames.BOOK, BookSchema)
