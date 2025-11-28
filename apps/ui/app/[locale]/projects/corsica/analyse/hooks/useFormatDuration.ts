import type { Duration } from 'date-fns';
import { useTranslation } from 'react-i18next';

export function useFormatDuration() {
  const { t } = useTranslation();

  const formatDuration = (duration: Duration) => {
    let string = '';

    if (duration.years || string.length > 0) {
      string += t('corsica.pages.analyse.durations.years', { years: duration.years });
    }
    if (duration.months || string.length > 0) {
      string += t('corsica.pages.analyse.durations.months', { months: duration.months });
    }
    if (duration.days > 0 || string.length > 0) {
      string += t('corsica.pages.analyse.durations.days', { days: duration.days });
    }
    if (duration.hours > 0 || string.length > 0) {
      if (string.length > 0) {
        string += ' ';
      }
      string += t('corsica.pages.analyse.durations.hours', { hours: duration.hours >= 10 ? duration.hours : '0' + duration.hours });
    }
    if (duration.minutes > 0 || string.length > 0) {
      if (string.length > 0) {
        string += 'h ';
      }
      string += t('corsica.pages.analyse.durations.minutes', { minutes: duration.minutes >= 10 ? duration.minutes : '0' + duration.minutes });
    }
    if (duration.seconds > 0 || string.length > 0) {
      if (string.length > 0) {
        string += 'm ';
      }
      string += t('corsica.pages.analyse.durations.seconds', { seconds: duration.seconds >= 10 ? duration.seconds : '0' + duration.seconds });
      string += 's';
    }

    return string;
  };

  return formatDuration;
}
