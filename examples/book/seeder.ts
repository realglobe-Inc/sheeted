import { IAMUserEntity } from '@sheeted/core'
import { createEntityId, IAMUserRepository } from '@sheeted/mongoose'

import { Seeder, reduce, defaultUsers } from '../util/seeder.util'

import { Roles, Genres, Formats, Role } from './constants'
import { BookRepository } from './sheets/book/book.repository'
import { BookEntity } from './sheets/book/book.entity'

const users: Partial<IAMUserEntity<Role>>[] = [
  ...defaultUsers,
  ...Array.from({ length: 60 }).map((_, i) => ({
    id: createEntityId(i),
    name: 'user' + String(i),
    email: `user${i}@example.com`,
    roles: [Roles.DEFAULT_ROLE],
  })),
]

const books: Partial<BookEntity>[] = [
  ...Array.from({ length: 30 }).map((_, i) => ({
    id: createEntityId(i),
    title: `Book ${i}`,
    like: 0,
    price: 1200,
    genre: Genres[i % Genres.length],
    formats: [Formats[i % Formats.length]],
    buyer: users[i % users.length] as IAMUserEntity<Role>,
    buyDate: 20200303,
    readMinutes: 121,
    publicationYear: 2018,
  })),
]

export const seeders = reduce([
  new Seeder<IAMUserEntity>(IAMUserRepository, users),
  new Seeder<BookEntity>(BookRepository, books),
])
