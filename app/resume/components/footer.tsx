'use client'

import React from 'react'
import { useTranslation } from 'next-i18next'

function Footer () {
  const { t } = useTranslation()
  return (
    <footer >
      <div >
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
