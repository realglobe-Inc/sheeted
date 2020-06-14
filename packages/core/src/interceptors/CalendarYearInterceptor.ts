import { Interceptor, ParseFailedError } from '../Interceptor.type'

export type CalendarYearRaw = number

export const CALENDAR_YEAR_FORMAT = 'YYYY'

/**
 * Calendar year (yyyy)
 */
export const CalendarYearInterceptor: Interceptor<CalendarYearRaw> = {
  parse(text: string) {
    const year = Number(text)
    if (!Number.isFinite(year)) {
      throw new ParseFailedError(`Failed to parse ${JSON.stringify(text)}`)
    }
    return Number(text)
  },
  stringify(year: number) {
    return String(year)
  },
}
