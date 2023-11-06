import { Duration } from 'date-fns'
import { useTranslation } from 'next-i18next'

export function useFormatDuration() {
  const { t } = useTranslation()

  const formatDuration = (duration: Duration) => {
    let string = ''

    if (duration.years) {
      string += t('corsica.pages.analyse.durations.years', { years: duration.years })
    }
    if (duration.months) {
      string += t('corsica.pages.analyse.durations.months', { months: duration.months })
    }
    if (duration.days) {
      string += t('corsica.pages.analyse.durations.days', { days: duration.days })
    }
    if (duration.hours) {
      if (duration.days) {
        string += ' '
      }
      string += t('corsica.pages.analyse.durations.hours', { hours: duration.hours })
    }
    if (duration.minutes) {
      if (duration.hours) {
        string += ':'
      }
      string += t('corsica.pages.analyse.durations.minutes', { minutes: duration.minutes })
    }
    if (duration.seconds) {
      if (duration.minutes) {
        string += ':'
      }
      string += t('corsica.pages.analyse.durations.seconds', { seconds: duration.seconds })
    }

    return string
  }

  return formatDuration
}
