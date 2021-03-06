import { Interceptor, ParseFailedError } from '../Interceptor.type'

export type TimeRaw = number

export const TIME_FORMAT = 'HH:mm'

const DELIMITER = ':'

export const TimeInterceptor: Interceptor<TimeRaw> = {
  parse(text: string) {
    const [hours, minutes] = text.split(DELIMITER).map(Number)
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
      throw new ParseFailedError(`Failed to parse ${JSON.stringify(text)}`)
    }
    return 60 * hours + minutes
  },
  stringify(time: TimeRaw) {
    const hours = Math.floor(time / 60)
    const minutes = time % 60
    return (
      String(hours).padStart(2, '0') +
      DELIMITER +
      String(minutes).padStart(2, '0')
    )
  },
}
