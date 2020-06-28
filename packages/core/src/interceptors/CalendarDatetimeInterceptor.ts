import { Interceptor, ParseFailedError } from '../Interceptor.type'

export type CalendarDatetimeRaw = number

export const CALENDAR_DATETIME_FORMAT = 'YYYY/MM/DD HH:mm'

const pad = (num: number) => String(num).padStart(2, '0')

/**
 * Calendar datetime (yyyy/MM/dd HH:mm)
 */
export const CalendarDatetimeInterceptor: Interceptor<CalendarDatetimeRaw> & {
  toDate(value: number): Date
  fromDate(date: Date): number
} = {
  parse(text: string) {
    // Format "yyyy/MM/dd HH:mm" can be parsed by Date
    const date = new Date(text)
    const value = date.getTime()
    if (Number.isNaN(value)) {
      throw new ParseFailedError(`Failed to parse ${JSON.stringify(text)}`)
    }
    return value
  },
  stringify(value: number) {
    const date = new Date(value)
    return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(
      date.getDate(),
    )} ${pad(date.getHours())}:${pad(date.getMinutes())}`
  },
  toDate(value: number) {
    return new Date(value)
  },
  fromDate(date: Date) {
    return date.getTime()
  },
}
