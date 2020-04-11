import MTTSHeader from '../../components/mtts/header'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
// eslint-disable-next-line no-unused-vars
import { NextPage } from 'next'
import ResearchIcon from '../../components/images/research-icon'

interface Experiment {
  title: string;
  description: string;
  link: string;
}

const HomePage: NextPage<{}> = () => {
  const { t } = useTranslation()
  const experiments: JSX.Element[] = (t('mtts.pages.index.experiments') as Experiment[]).map(e => {
    return (
      <li key={e.title} className="py-4">
        <h5 className="text-2xl">{e.title}</h5>
        <p>{e.description}</p>
        <a className="text-mtts-light-violet" href={e.link}>{t('mtts.pages.index.experimentsLink')}</a>
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
          <div className="w-icon-l p-4 md:pl-32">
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

HomePage.getInitialProps = _ => {
  return {}
}

export default HomePage
