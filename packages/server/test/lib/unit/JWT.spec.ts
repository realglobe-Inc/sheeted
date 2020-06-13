import '../../tools/typings'
import { JWT } from '../../../src/JWT'

test('JWT', async () => {
  const jwt = new JWT('secret', '1s')

  const user = { email: 'example@example.com' } as any
  const token = await jwt.sign(user)
  const payload = await jwt.verify(token)
  expect(payload).toMatchObject(user)
  await new Promise((resolve) => setTimeout(resolve, 1001))
  expect(await jwt.verify(token)).toBeNull()
})
