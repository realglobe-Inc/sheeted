import { IAMUserEntity } from '../../entities/IAMUserEntity.type'
import { View } from '../../View.type'

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
