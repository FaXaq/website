import type { Duration } from 'date-fns';

import { m } from '@/paraglide/messages';

export function useFormatDuration() {
  const formatDuration = (duration: Duration) => {
    let string = '';

    if (duration.years && (duration.years > 0 || string.length > 0)) {
      string += m['corsica_pages_analyse_durations_years']({ years: duration.years });
    }
    if (duration.months && (duration.months > 0 || string.length > 0)) {
      string += m['corsica_pages_analyse_durations_months']({ months: duration.months });
    }
    if (duration.days && (duration.days > 0 || string.length > 0)) {
      string += m['corsica_pages_analyse_durations_days']({ days: duration.days });
    }
    if (duration.hours && (duration.hours > 0 || string.length > 0)) {
      if (string.length > 0) {
        string += ' ';
      }
      string += m['corsica_pages_analyse_durations_hours']({ hours: duration.hours ?? 0 >= 10 ? duration.hours : '0' + duration.hours });
    }
    if (duration.minutes && (duration.minutes > 0 || string.length > 0)) {
      if (string.length > 0) {
        string += 'h ';
      }
      string += m['corsica_pages_analyse_durations_minutes']({ minutes: duration.minutes ?? 0 >= 10 ? duration.minutes : '0' + duration.minutes });
    }
    if (duration.seconds && (duration.seconds > 0 || string.length > 0)) {
      if (string.length > 0) {
        string += 'm ';
      }
      string += m['corsica_pages_analyse_durations_seconds']({ seconds: duration.seconds ?? 0 >= 10 ? duration.seconds : '0' + duration.seconds });
      string += 's';
    }

    return string;
  };

  return formatDuration;
}
