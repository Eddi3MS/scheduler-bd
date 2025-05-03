import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isBetween from 'dayjs/plugin/isBetween'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

dayjs.extend(isSameOrAfter)
dayjs.extend(customParseFormat)
dayjs.extend(isSameOrBefore)
dayjs.extend(isBetween)
dayjs.extend(utc)
dayjs.extend(timezone)

const TIMEZONE = 'America/Sao_Paulo'

export const parseDateTime = (date: string, time: string) => {
  const datetime = dayjs.tz(`${date} ${time}`, 'YYYY-MM-DD HH:mm', TIMEZONE)

  if (!datetime.isValid()) {
    console.error(`Invalid date/time: ${date} ${time}`)
    throw new RangeError(`Invalid time value: ${date} ${time}`)
  }

  return datetime
}

export const getDayOfWeek = (date: string) => {
  return dayjs.tz(date, 'YYYY-MM-DD', TIMEZONE).day()
}

export const addMinutes = (date: dayjs.Dayjs, minutes: number) => {
  return date.add(minutes, 'minute')
}

export const isValidDateTime = (date: dayjs.Dayjs) => {
  return date.isValid()
}

export const isSameOrBeforeTime = (a: dayjs.Dayjs, b: dayjs.Dayjs) => {
  return a.isSameOrBefore(b)
}

export const formatTime = (date: dayjs.Dayjs) => {
  return date.tz(TIMEZONE).format('HH:mm')
}

export function isToday(date: string): boolean {
  return dayjs().tz(TIMEZONE).format('YYYY-MM-DD') === date
}

export function getNow() {
  return dayjs().tz(TIMEZONE)
}

export function getTodayStr() {
  return dayjs().format('YYYY-MM-DD')
}

export const hasTimeConflict = (
  startA: dayjs.Dayjs,
  endA: dayjs.Dayjs,
  startB: dayjs.Dayjs,
  endB: dayjs.Dayjs
) => {
  return startA.isBefore(endB) && endA.isAfter(startB)
}
