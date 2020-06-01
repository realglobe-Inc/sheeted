import React, {
  createContext,
  useContext,
  ReactChild,
  useState,
  useCallback,
  FC,
} from 'react'
import { InputValidationErrors } from '@sheeted/core/build/web/Shared.type'

export type InputErrors = {
  [field: string]: string | undefined
}

export type InputErrorContextValues = {
  errors: InputErrors
  setErrors: (errors: InputValidationErrors) => void
  reset: (field?: string) => void
}

const InputErrorContext = createContext<InputErrorContextValues>(null as any)

export const useInputErrorContext = (): InputErrorContextValues =>
  useContext(InputErrorContext)

export const useInputErrorFromContext = (field: string): string | undefined => {
  const { errors } = useInputErrorContext()
  return errors[field]
}

export const InputErrorContextProvider: FC<{ children: ReactChild }> = (
  props,
) => {
  const [errors, set] = useState<InputErrors>({})
  const setErrors = useCallback(
    (err: InputValidationErrors) =>
      set(
        Object.fromEntries(
          err.errors.map(({ field, message }) => [field, message]),
        ),
      ),
    [set],
  )
  const reset = useCallback(
    (field?: string) => (field ? set({ [field]: undefined }) : set({})),
    [set],
  )
  return (
    <InputErrorContext.Provider value={{ errors, setErrors, reset }}>
      {props.children}
    </InputErrorContext.Provider>
  )
}
