import '../../tools/typings'

import {
  UserAccessPolicy,
  UserAccessPolicyAdditional,
} from '../../../src/controllers/concern/UserAccessPolicy'

test('UserAccessPolicy', () => {
  const userRoles = ['default']
  const columns = ['foo1', 'foo2', 'foo3', 'foo4']

  {
    expect(
      new UserAccessPolicy(
        userRoles,
        [
          {
            action: 'read',
            role: 'default',
            column: undefined,
          },
        ],
        columns,
      ).ofRead,
    ).toMatchObject({
      allowedColumns: columns,
      deniedColumns: [],
    } as UserAccessPolicyAdditional)
  }
  {
    expect(
      new UserAccessPolicy(
        userRoles,
        [
          {
            action: 'read',
            role: 'default',
            column: {
              effect: 'allow',
              columns: ['foo1', 'foo2'],
            },
          },
        ],
        columns,
      ).ofRead,
    ).toMatchObject({
      allowedColumns: ['foo1', 'foo2'],
      deniedColumns: ['foo3', 'foo4'],
    } as UserAccessPolicyAdditional)
  }
  {
    expect(
      new UserAccessPolicy(
        userRoles,
        [
          {
            action: 'read',
            role: 'default',
            column: {
              effect: 'deny',
              columns: ['foo1', 'foo2'],
            },
          },
        ],
        columns,
      ).ofRead,
    ).toMatchObject({
      allowedColumns: ['foo3', 'foo4'],
      deniedColumns: ['foo1', 'foo2'],
    } as UserAccessPolicyAdditional)
  }
})
