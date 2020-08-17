export const ENTITY_META_FIELD = '$meta' as const

export const HttpStatuses = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const

export const ValidationErrorTypes = {
  READONLY: 'validation_error:readonly',
  REQUIRED: 'validation_error:required',
  DUPLICATE: 'validation_error:duplicate',
  VALUE_TYPE: 'validation_error:value_type',
  ENUM: 'validation_error:enum',
  CUSTOM: 'validation_error:custom',
} as const

export const OperationFailureReasons = {
  PERMISSION_DENIED: 'operation_result:permission_denied',
  NOT_FOUND: 'operation_result:not_found',
  CUSTOM: 'operation_result:not_found',
} as const

export const DeleteFailureReasons = {
  ...OperationFailureReasons,
  RESTRICT: 'operation_result:restrict',
} as const
