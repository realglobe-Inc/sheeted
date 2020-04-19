/**
 * Validation result
 */
export class ValidationResult<Entity = any> {
  private _errors: {
    field: string
    message: string
  }[] = []

  get isOk() {
    return this._errors.length === 0
  }

  get errors() {
    return [...this._errors]
  }

  appendError(error: {
    field: Exclude<keyof Entity, 'id' | number | symbol>
    message: string
  }) {
    this._errors.push(error)
  }
}
