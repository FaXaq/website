'use client'

import React from 'react'
import MTTSHeader from './components/header'
import { Trans, useTranslation } from 'next-i18next'
import ResearchIcon from '../../components/images/research-icon'
import Link from 'next/link'

interface Experiment {
  title: string;
  description: string;
  link: string;
}

function Page() {
  const { t } = useTranslation()
  const experiments: React.JSX.Element[] = (t('mtts.pages.index.experiments') as unknown as Experiment[]).map(e => {
    return (
      <li key={e.title} className="py-4">
        <h5 className="text-2xl">{e.title}</h5>
        <p>{e.description}</p>
        <Link href={e.link} className="text-mtts-light-violet">
          {t('mtts.pages.index.experimentsLink')}
        </Link>
      </li>
    )
  })

  return (
    <div className="font-sans">
      <MTTSHeader />
      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse md:flex-row justify-between items-center py-8 md:py-16">
          <div className="md:pr-32">
            <h3 className="text-4xl font-bold pb-4">{t('mtts.pages.index.research.title')}</h3>
            <p className="leading-loose"><Trans t={t}>mtts.pages.index.research.text</Trans></p>
          </div>
          <div className="w-icon-l h-icon-l p-4 md:w-icon-xl md:h-icon-xl md:p-8">
            <ResearchIcon />
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-bold pb-4">{t('mtts.pages.index.experimentsTitle')}</h3>
          <ul>
            {experiments}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Page
