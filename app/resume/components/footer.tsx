'use client'

import React from 'react'
import { useTranslation } from 'next-i18next'

function Footer () {
  const { t } = useTranslation()
  return (
    <footer className="bg-light-sand text-dark-sand print:hidden">
      <div className="container px-4 lg:px-0 py-6 mx-auto">
        <p>
          {t('resume.copy')}
          <a target="_blank" rel="noopener noreferrer" href="https://github.com/faxaq/website">
            github
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer
