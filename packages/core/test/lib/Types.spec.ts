import { typeEquals, Types } from '../../src/Types'

test('typeEquals()', () => {
  const types = Object.values(Types)
  types.forEach((type, index) => {
    expect(typeEquals(type, type)).toBeTruthy()
    const nextIndex = (index + 1) % types.length
    expect(typeEquals(type, types[nextIndex])).toBeFalsy()
  })
})
