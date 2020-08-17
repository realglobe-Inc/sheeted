import React, {
  createContext,
  useContext,
  ReactChild,
  useState,
  useCallback,
  FC,
} from 'react'
import { InputError } from '@sheeted/core/build/web/Shared.type'
import { ValidationErrorTypes } from '@sheeted/core/build/web/Consts'

import { useLocale } from '../../../hooks/LocaleContextHook'

export type InputErrorRecord = {
  [field: string]: string | undefined
}

export type InputErrorContextValues = {
  errors: InputErrorRecord
  setErrors: (errors: InputError[]) => void
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
  const l = useLocale()
  const [errors, set] = useState<InputErrorRecord>({})
  const setErrors = useCallback(
    (errors: InputError[]) =>
      set(
        Object.fromEntries(
          errors.map((err) => {
            const message =
              err.type === ValidationErrorTypes.CUSTOM
                ? err.message
                : l.validationErrors[err.type]
            return [err.field, message]
          }),
        ),
      ),
    [set, l],
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
