import {
  CalendarDateInterceptor,
  CalendarMonthInterceptor,
  CalendarYearInterceptor,
  TimeInterceptor,
} from '../../src/interceptors'

test('CalendarDateInterceptor', () => {
  const { parse, stringify, toDate } = CalendarDateInterceptor
  expect(stringify(parse('2020/01/02'))).toBe('2020/01/02')
  expect(toDate(parse('2020/01/02'))).toEqual(new Date(2020, 0, 2))
})

test('CalendarMonthInterceptor', () => {
  const { parse, stringify, toDate } = CalendarMonthInterceptor
  expect(stringify(parse('2020/01'))).toBe('2020/01')
  expect(toDate(parse('2020/02'))).toEqual(new Date(2020, 1))
})

test('CalendarYearInterceptor', () => {
  const { parse, stringify } = CalendarYearInterceptor
  expect(stringify(parse('2020'))).toBe('2020')
})

test('TimeInterceptor', () => {
  const { parse, stringify } = TimeInterceptor
  expect(stringify(parse('13:03'))).toBe('13:03')
})
