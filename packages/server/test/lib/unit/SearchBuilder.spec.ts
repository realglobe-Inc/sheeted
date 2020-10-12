import { Types, SearchQuery, Schema } from '@sheeted/core'

import { SearchBuilder } from '../../../src/controllers/concern/SearchBuilder'

test('SearchBuilder', () => {
  type Entity = {
    text: string
    long: string
    num: number
  }
  const schema: Schema<Entity> = {
    text: {
      type: Types.Text,
    },
    long: {
      type: Types.LongText,
    },
    num: {
      type: Types.Numeric,
    },
  }
  const build = (search: string) => new SearchBuilder(schema).build(search)

  expect(build('')).toBe(undefined)

  {
    const query: SearchQuery<Entity> = {
      fields: ['text', 'long'],
      words: ['foo', 'bar'],
    }
    expect(build('foo bar')).toEqual(query) // \s
    expect(build('foo  bar')).toEqual(query) // \s\s
    expect(build('foo　bar')).toEqual(query) // 全角
    expect(build('foo bar')).toEqual(query) // \t
  }
})
