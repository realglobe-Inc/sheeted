import { MongoDriver } from '@sheeted/mongoose'

import { SheetNames } from '../../constants'

import { BookSchema } from './book.schema'

export const BookRepository = new MongoDriver(SheetNames.BOOK, BookSchema)
