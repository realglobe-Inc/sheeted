import { EntityBase } from './EntityBase.type'

type ValidationError = {
  field: string
  message: string
}

/**
 * Validation result
 */
export class ValidationResult<Entity = any> {
  private _errors: ValidationError[] = []

  get isOk(): boolean {
    return this._errors.length === 0
  }

  get errors(): ValidationError[] {
    return [...this._errors]
  }

  appendError(error: {
    field: Exclude<keyof Entity, keyof EntityBase | number | symbol>
    message: string
  }): void {
    this._errors.push(error)
  }
}
