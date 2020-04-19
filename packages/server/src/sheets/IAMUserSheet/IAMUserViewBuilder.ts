import { View, IAMUserEntity } from '@sheeted/core'

export const buildIAMUserView = (roleLabels: { [role: string]: string }) => {
  const IAMUserView: View<IAMUserEntity<string>> = {
    title: 'IAM User',
    display: (user) => user.name,
    columns: {
      name: {
        title: 'User name',
      },
      email: {
        title: 'Email',
      },
      roles: {
        title: 'Roles',
        enumLabels: roleLabels,
      },
    },
  }
  return IAMUserView
}
