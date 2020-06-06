import { dropUndef } from '../../../src/utils/objectUtil'

test('dropUndef()', () => {
  expect(
    dropUndef({
      a: 1,
      b: undefined,
      c: null,
      d: {
        a: 'a',
        b: undefined,
        c: null,
        d: {
          a: 'a',
          b: undefined,
          c: null,
        },
      },
    }),
  ).toStrictEqual({
    a: 1,
    c: null,
    d: {
      a: 'a',
      c: null,
      d: {
        a: 'a',
        c: null,
      },
    },
  })
})
