import { IAMUserEntity } from '../../entities/IAMUserEntity.type'
import { View } from '../../View.type'

export const buildIAMUserView = (roleLabels: {
  [role: string]: string
}): View<IAMUserEntity<string>> => {
  const IAMUserView: View<IAMUserEntity<string>> = {
    title: 'IAM User',
    display: (user) => user.name,
    columns: [
      {
        field: 'name',
        title: 'Name',
      },
      {
        field: 'email',
        title: 'Email',
      },
      {
        field: 'roles',
        title: 'Roles',
        enumLabels: roleLabels,
      },
    ],
  }
  return IAMUserView
}
