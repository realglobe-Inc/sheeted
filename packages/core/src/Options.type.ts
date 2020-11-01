import { View } from './View.type'
import { IAMUserEntity } from './entities/IAMUserEntity.type'

export type Options = {
  iamUserView?: Partial<View<IAMUserEntity>>
}
