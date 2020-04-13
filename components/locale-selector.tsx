import React from 'react'
import { useTranslation } from 'react-i18next'

function LocaleSelector () {
  const { t, i18n } = useTranslation()
  const fallbackLocales = []

  for (const l of i18n.languages.sort()) {
    const classes = ['p-1']
    if (i18n.language === l) {
      classes.push('text-white')
    } else {
      classes.push('text-dark-sand')
    }

    fallbackLocales.push(
      <div
        key={l}
        className={classes.join(' ')}
        onClick={() => {
          i18n.changeLanguage(l)
        }}
      >
        {t(`locales.${l}`)}
      </div>
    )
  }

  return (
    <div className="flex flex-row cursor-pointer m-6">{fallbackLocales}</div>
  )
}

export default LocaleSelector
