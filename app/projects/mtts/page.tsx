'use client'

import React from 'react'
import MTTSHeader from './components/header'
import { Trans, useTranslation } from 'next-i18next'
import ResearchIcon from '../../components/images/research-icon'
import Link from 'next/link'
import MTTSFooter from './components/Footer'

interface Experiment {
  title: string;
  description: string;
  link: string;
}

function Page() {
  const { t } = useTranslation()
  const experiments: React.JSX.Element[] = (t('mtts.pages.index.experiments') as unknown as Experiment[]).map(e => {
    return (
      <li key={e.title} >
        <h5 >{e.title}</h5>
        <p>{e.description}</p>
        <Link href={e.link} >
          {t('mtts.pages.index.experimentsLink')}
        </Link>
      </li>
    )
  })

  return (
    <div >
      <MTTSHeader />
      <div >
        <div >
          <div >
            <h3 >{t('mtts.pages.index.research.title')}</h3>
            <p ><Trans t={t}>mtts.pages.index.research.text</Trans></p>
          </div>
          <div >
            <ResearchIcon />
          </div>
        </div>
        <div>
          <h3 >{t('mtts.pages.index.experimentsTitle')}</h3>
          <ul>
            {experiments}
          </ul>
        </div>
      </div>
      <div >
        <MTTSFooter />
      </div>
    </div>
  )
}

export default Page
