import { Interceptor } from '../Interceptor.type'

export type CalendarMonthRaw = number

export const CALENDAR_MONTH_FORMAT = 'YYYY/MM'

const DELIMITER = '/'

/**
 * Calendar month (YYYY/MM)
 */
export const CalendarMonthInterceptor: Interceptor<CalendarMonthRaw> & {
  toDate(value: number): Date
  fromDate(date: Date): number
} = {
  parse(text: string) {
    const [year, month] = text.split(DELIMITER).map(Number)
    return month + 100 * year
  },
  stringify(value: number) {
    const year = Math.floor(value / 100)
    const month = value % 100
    return [String(year).padStart(4, '0'), String(month).padStart(2, '0')].join(
      DELIMITER,
    )
  },
  toDate(value: number) {
    const year = Math.floor(value / 100)
    const month = value % 100
    return new Date(year, month - 1)
  },
  fromDate(date: Date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    return month + 100 * year
  },
}
