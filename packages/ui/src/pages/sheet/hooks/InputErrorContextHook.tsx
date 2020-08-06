import React, {
  createContext,
  useContext,
  ReactChild,
  useState,
  useCallback,
  FC,
} from 'react'
import { InputErrors } from '@sheeted/core/build/web/Shared.type'

export type InputErrorRecord = {
  [field: string]: string | undefined
}

export type InputErrorContextValues = {
  errors: InputErrorRecord
  setErrors: (errors: InputErrors) => void
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
  const [errors, set] = useState<InputErrorRecord>({})
  const setErrors = useCallback(
    (errors: InputErrors) =>
      set(
        Object.fromEntries(
          errors.map(({ field, message }) => [field, message]),
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
