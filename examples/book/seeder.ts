import { Types } from 'mongoose'
import { IAMUserEntity } from '@sheeted/core'
import { IAMUserModel } from '@sheeted/mongoose'

import { Seeder, reduce, defaultUsers } from '../util/seeder.util'

import { Roles, Genres, Formats, Role } from './constants'
import { BookModel } from './sheets/book/book.model'
import { BookEntity } from './sheets/book/book.entity'

const users: IAMUserEntity<Role>[] = [
  ...defaultUsers,
  ...Array.from({ length: 60 }).map((_, i) => ({
    // _id is required because is is used in book.buyer reference for mongo internal use.
    _id: Types.ObjectId.createFromTime(i),
    id: 'user' + String(i),
    name: 'user' + String(i),
    email: `user${i}@example.com`,
    roles: [Roles.DEFAULT_ROLE],
  })),
]

const books: BookEntity[] = [
  ...Array.from({ length: 30 }).map((_, i) => ({
    id: `book-${i}`,
    title: `Book ${i}`,
    like: 0,
    price: 1200,
    genre: Genres[i % Genres.length],
    formats: [Formats[i % Formats.length]],
    buyer: users[i % users.length],
    buyDate: 20200303,
    publicationYear: 2018,
  })),
]

export const seeders = reduce([
  new Seeder<IAMUserEntity>(IAMUserModel, users),
  new Seeder<BookEntity>(BookModel, books),
])
