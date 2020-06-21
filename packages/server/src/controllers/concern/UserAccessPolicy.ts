import {
  ReadAccessPolicy,
  CreateAccessPolicy,
  UpdateAccessPolicy,
  DeleteAccessPolicy,
  ActionAccessPolicy,
  AccessPolicy,
  AdminAccessPolicies,
  ColumnPolicyOption,
} from '@sheeted/core'

export type UserAccessPolicyAdditional = {
  allowedColumns: string[]
  deniedColumns: string[]
}

const columnsFromOption = (
  columns: string[],
  option?: ColumnPolicyOption<string>,
): UserAccessPolicyAdditional => {
  if (!option) {
    return {
      allowedColumns: columns,
      deniedColumns: [],
    }
  }
  switch (option.effect) {
    case 'allow':
      return {
        allowedColumns: option.columns,
        deniedColumns: columns.filter(
          (column) => !option.columns.includes(column),
        ),
      }
    case 'deny':
      return {
        allowedColumns: columns.filter(
          (column) => !option.columns.includes(column),
        ),
        deniedColumns: option.columns,
      }
  }
}

export class UserAccessPolicy {
  readonly ofRead?: ReadAccessPolicy & UserAccessPolicyAdditional
  readonly ofCreate?: CreateAccessPolicy & UserAccessPolicyAdditional
  readonly ofUpdate?: UpdateAccessPolicy & UserAccessPolicyAdditional
  readonly ofDelete?: DeleteAccessPolicy
  readonly ofActions?: ActionAccessPolicy[]

  constructor(
    userRoles: string[],
    accessPolicies: AccessPolicy[],
    columns: string[],
  ) {
    const userAccessPolicies = accessPolicies
      .concat(AdminAccessPolicies)
      .filter((policy) => userRoles.includes(policy.role))
    this.ofRead = userAccessPolicies
      .filter((policy): policy is ReadAccessPolicy => policy.action === 'read')
      .map((policy) => ({
        ...policy,
        ...columnsFromOption(
          columns,
          policy.column as ColumnPolicyOption<string>,
        ),
      }))
      .pop()
    this.ofCreate = userAccessPolicies
      .filter(
        (policy): policy is CreateAccessPolicy => policy.action === 'create',
      )
      .map((policy) => ({
        ...policy,
        ...columnsFromOption(
          columns,
          policy.column as ColumnPolicyOption<string>,
        ),
      }))
      .pop()
    this.ofUpdate = userAccessPolicies
      .filter(
        (policy): policy is UpdateAccessPolicy => policy.action === 'update',
      )
      .map((policy) => ({
        ...policy,
        ...columnsFromOption(
          columns,
          policy.column as ColumnPolicyOption<string>,
        ),
      }))
      .pop()
    this.ofDelete = userAccessPolicies
      .filter(
        (policy): policy is DeleteAccessPolicy => policy.action === 'delete',
      )
      .pop()
    this.ofActions = userAccessPolicies.filter(
      (policy): policy is ActionAccessPolicy => policy.action === 'custom',
    )
  }
}
