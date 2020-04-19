import { Interceptor } from '../Interceptor.type'

export type CalendarDateRaw = number

export const CALENDAR_DATE_FORMAT = 'YYYY/MM/DD'

const DELIMITER = '/'

/**
 * Calendar date (yyyy/MM/dd)
 */
export const CalendarDateInterceptor: Interceptor<CalendarDateRaw> & {
  toDate(value: number): Date
  fromDate(date: Date): number
} = {
  parse(text: string) {
    const [year, month, day] = text.split(DELIMITER).map(Number)
    return day + 100 * month + 10000 * year
  },
  stringify(value: number) {
    const year = Math.floor(value / 10000)
    const month = Math.floor((value % 10000) / 100)
    const day = value % 100
    return [
      String(year).padStart(4, '0'),
      String(month).padStart(2, '0'),
      String(day).padStart(2, '0'),
    ].join(DELIMITER)
  },
  toDate(value: number) {
    const year = Math.floor(value / 10000)
    const month = Math.floor((value % 10000) / 100)
    const day = value % 100
    return new Date(year, month - 1, day)
  },
  fromDate(date: Date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return day + 100 * month + 10000 * year
  },
}
