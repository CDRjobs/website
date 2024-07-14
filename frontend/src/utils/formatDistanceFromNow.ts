import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInSeconds,
  differenceInWeeks,
  differenceInYears,
  formatDistanceToNowStrict,
} from 'date-fns'

const formatDistanceFromNow = (date: Date) => {
  const gaps = [{
    value: differenceInYears(new Date(), date),
    unit: 'y',
  }, {
    value: differenceInMonths(new Date(), date),
    unit: 'm',
  }, {
    value: differenceInWeeks(new Date(), date),
    unit: 'w',
  }, {
    value: differenceInDays(new Date(), date),
    unit: 'd',
  }, {
    value: differenceInHours(new Date(), date),
    unit: 'h',
  }, {
    value: differenceInMinutes(new Date(), date),
    unit: 'min',
  }, {
    value: differenceInSeconds(new Date(), date),
    unit: 's',
  }]

  const relevantGap = gaps.find(({ value }) => value)
  
  return relevantGap ? `${relevantGap.value}${relevantGap.unit}` : formatDistanceToNowStrict(date)

}

export default formatDistanceFromNow