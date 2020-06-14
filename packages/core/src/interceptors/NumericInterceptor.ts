import { Interceptor, ParseFailedError } from '../Interceptor.type'

/**
 * Numeric value
 */
export const NumericInterceptor: Interceptor<number> = {
  parse(text: string) {
    const num = Number(text)
    if (!Number.isFinite(num)) {
      throw new ParseFailedError(`Failed to parse ${JSON.stringify(text)}`)
    }
    return Number(num)
  },
  stringify(year: number) {
    return String(year)
  },
}
