import { format as formatDate,setDefaultOptions } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { z } from "zod";

import ENTranslation from './assets/locales/en.json';
import FRTranslation from './assets/locales/fr.json';

export const LocaleZodType = z.enum([
  "en",
  "fr"
]);

export const LocaleEnum = LocaleZodType.enum;
export type Locale = z.infer<typeof LocaleZodType>;


const dateFnsLocales = {
  en: enUS,
  fr
};

i18n.on('languageChange', (language: string) => {
  setDefaultOptions({ locale: dateFnsLocales[language] });
});

setDefaultOptions({ locale: dateFnsLocales.en });

const resources = {
  en: {
    translation: ENTranslation
  },
  fr: {
    translation: FRTranslation
  }
};

i18n
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: ['en', 'fr'],
    debug: false,
    resources,
    returnObjects: true,
    interpolation: {
      escapeValue: false
    }
  });

i18n.services.formatter.add('uppercase', (value: string) => {
  return value.toUpperCase();
});

i18n.services.formatter.add('capitalise', (value: string) => {
  return value.charAt(0).toUpperCase() + value.substring(1);
});

i18n.services.formatter.add('translateDate', (value: Date, _, options: { format: string}) => {
  return formatDate(value, options.format);
});

export default i18n;
