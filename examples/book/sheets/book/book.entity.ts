import { EntityBase, IAMUserEntity } from '@sheeted/core'

import { Genre, Format } from '../../constants'

export interface BookEntity extends EntityBase {
  title: string
  like: number
  price: number
  genre: Genre
  formats: Format[]
  url?: string
  buyer: IAMUserEntity
  buyDate: number
  readFinishedAt: number
  readMinutes: number
  publicationYear: number
  comment?: string
}
