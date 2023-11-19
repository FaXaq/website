'use client'

import React from 'react'

import Header from './components/header'
import Footer from './components/footer'
import Content from './components/content'
import { useTranslation } from 'react-i18next'

function HomePage () {
  const { t } = useTranslation()

  return (
    <div className="font-sans">
      <Header />
      <div className="container mx-auto p-4 md:px-0">
        <p className="py-4">
          {t('resume.description')}
        </p>
        <Content />
      </div>
      <Footer />
    </div>
  )
}

export default HomePage
