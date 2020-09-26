import { type } from 'os'

import { Type } from './Type.type'
import {
  CalendarDateInterceptor,
  TimeInterceptor,
  CALENDAR_DATE_FORMAT,
  CALENDAR_DATETIME_FORMAT,
  CALENDAR_YEAR_FORMAT,
  CALENDAR_MONTH_FORMAT,
  TIME_FORMAT,
  CalendarDatetimeInterceptor,
  CalendarYearInterceptor,
  CalendarMonthInterceptor,
  NumericInterceptor,
} from './interceptors'

const Text: Type<string> = {
  rawType: 'text',
  form: 'text',
}

const LongText: Type<string> = {
  rawType: 'text',
  form: 'text-multiline',
}

const Numeric: Type<number> = {
  rawType: 'number',
  form: 'number',
  interceptor: NumericInterceptor,
}

const CalendarDate: Type<number> = {
  rawType: 'number',
  form: 'calendar',
  formOptions: {
    format: CALENDAR_DATE_FORMAT,
  },
  interceptor: CalendarDateInterceptor,
}

const CalendarDatetime: Type<number> = {
  rawType: 'number',
  form: 'calendar_datetime',
  formOptions: {
    format: CALENDAR_DATETIME_FORMAT,
  },
  interceptor: CalendarDatetimeInterceptor,
}

const CalendarMonth: Type<number> = {
  rawType: 'number',
  form: 'calendar',
  formOptions: {
    format: CALENDAR_MONTH_FORMAT,
    views: ['year', 'month'],
  },
  interceptor: CalendarMonthInterceptor,
}

const CalendarYear: Type<number> = {
  rawType: 'number',
  form: 'calendar',
  formOptions: {
    format: CALENDAR_YEAR_FORMAT,
    views: ['year'],
  },
  interceptor: CalendarYearInterceptor,
}

const Time: Type<number> = {
  rawType: 'number',
  form: 'time',
  formOptions: {
    format: TIME_FORMAT,
  },
  interceptor: TimeInterceptor,
}

const Enum: Type<any> = {
  rawType: 'text',
  form: 'select',
}

const EnumList: Type<any> = {
  rawType: 'text_list',
  form: 'select-multiple',
}

const Entity: Type<any> = {
  rawType: 'entity',
  form: 'entity',
}

export const Types = {
  Text,
  LongText,
  Numeric,
  CalendarDate,
  CalendarDatetime,
  CalendarMonth,
  CalendarYear,
  Time,
  Enum,
  EnumList,
  Entity,
}

export const typeEquals = (typeA: Type<any>, typeB: Type<any>): boolean => {
  return (Object.keys(typeA) as (keyof Type<any>)[]).every(
    (key) => typeA[key] === typeB[key],
  )
}
