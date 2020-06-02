import { Interceptor } from './Interceptor.type'

export type InputForm =
  | 'text'
  | 'text-multiline'
  | 'number'
  | 'calendar'
  | 'time'
  | 'select'
  | 'select-multiple'
  | 'entity'

export type RawType = 'text' | 'text_list' | 'number' | 'entity'

/**
 * Data type considering input form.
 */
export type Type<Raw> = {
  rawType: RawType
  form: InputForm
  formOptions?: {
    format: string
    views?: string[]
  }
  interceptor?: Interceptor<Raw>
}
