import {
  ReadAccessPolicy,
  CreateAccessPolicy,
  UpdateAccessPolicy,
  DeleteAccessPolicy,
  ActionAccessPolicy,
  AccessPolicy,
  AdminAccessPolicies,
} from '@sheeted/core'

export class UserAccessPolicy {
  readonly ofRead?: ReadAccessPolicy
  readonly ofCreate?: CreateAccessPolicy
  readonly ofUpdate?: UpdateAccessPolicy
  readonly ofDelete?: DeleteAccessPolicy
  readonly ofAction?: ActionAccessPolicy

  constructor(userRoles: string[], accessPolicies: AccessPolicy[]) {
    const userAccessPolicies = accessPolicies
      .concat(AdminAccessPolicies)
      .filter((policy) => userRoles.includes(policy.role))
    this.ofRead = userAccessPolicies
      .filter((policy): policy is ReadAccessPolicy => policy.action === 'read')
      .pop()
    this.ofCreate = userAccessPolicies
      .filter(
        (policy): policy is CreateAccessPolicy => policy.action === 'create',
      )
      .pop()
    this.ofUpdate = userAccessPolicies
      .filter(
        (policy): policy is UpdateAccessPolicy => policy.action === 'update',
      )
      .pop()
    this.ofDelete = userAccessPolicies
      .filter(
        (policy): policy is DeleteAccessPolicy => policy.action === 'delete',
      )
      .pop()
    this.ofAction = userAccessPolicies
      .filter(
        (policy): policy is ActionAccessPolicy => policy.action === 'custom',
      )
      .pop()
  }
}
