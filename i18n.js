import i18n from 'i18next'
import {
  initReactI18next
} from 'react-i18next'
import FRTranslation from './assets/locales/fr.json'
import ENTranslation from './assets/locales/en.json'
import moment from 'moment'

const resources = {
  en: {
    translation: ENTranslation
  },
  fr: {
    translation: FRTranslation
  }
}

i18n
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: ['en', 'fr'],
    debug: false,
    resources,
    returnObjects: true,

    interpolation: {
      escapeValue: false,
      format: function (value, format) {
        if (format === 'uppercase') return value.toUpperCase()
        if (value instanceof Date) return moment(value).format(format || 'MM/DD/YYYY')
        return value
      }
    }
  })

export default i18n
