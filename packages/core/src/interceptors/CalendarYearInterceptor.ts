import { Interceptor } from '../Interceptor.type'

export type CalendarYearRaw = number

export const CALENDAR_YEAR_FORMAT = 'YYYY'

/**
 * Calendar year (yyyy)
 */
export const CalendarYearInterceptor: Interceptor<CalendarYearRaw> = {
  parse(text: string) {
    // これならただの数値型で良いのでは？
    return Number(text)
  },
  stringify(year: number) {
    return String(year)
  },
}
