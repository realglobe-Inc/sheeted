import { Context } from './Context.type'
import { ValidationResult } from './ValidationResult'

export type Validate<E = any> = (
  input: Partial<E>,
  currentEntity: E | null,
) => ValidationResult<E> | Promise<ValidationResult<E>>

/**
 * Validator. This is higher order function which returns validation function.
 */
export type Validator<E = any> = (context: Context<any>) => Validate<E>
