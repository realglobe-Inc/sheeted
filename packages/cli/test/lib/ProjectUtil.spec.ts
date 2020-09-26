import { strict as assert } from 'assert'

import { assertProjectName } from '../../src/utils/ProjectUtil'

test('assertProjectName()', () => {
  assert.doesNotThrow(() => assertProjectName('foo'))
  assert.doesNotThrow(() => assertProjectName('123foo'))
  assert.doesNotThrow(() => assertProjectName('foo-bar'))
  assert.doesNotThrow(() => assertProjectName('foo_bar'))
  assert.doesNotThrow(() => assertProjectName('foo.js'))

  assert.throws(() => assertProjectName('Foo'))
  assert.throws(() => assertProjectName('foo/bar'))
  assert.throws(() => assertProjectName('@foo'))
  assert.throws(() => assertProjectName('あいう'))
})
