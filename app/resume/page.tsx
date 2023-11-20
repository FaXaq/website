'use client'

import React from 'react'

import Header from './components/header'
import Footer from './components/footer'
import { useTranslation } from 'react-i18next'
import useCategory from './hooks/useCategory'
import ExperienceIcon from '../components/images/experience-icon'
import StudyIcon from '../components/images/study-icon'
import AchievementIcon from '../components/images/achievement-icon'
import MiscIcon from '../components/images/misc-icon'
import ProjectIcon from '../components/images/project-icon'
import Link from 'next/link'

function HomePage () {
  const { t } = useTranslation()
  const experiences = useCategory('experiences', ExperienceIcon)
  const studies = useCategory('studies', StudyIcon)
  const achievements = useCategory('achievements', AchievementIcon)
  const projects = useCategory('projects', ProjectIcon)
  const misc = useCategory('misc', MiscIcon)

  return (
    <div className="font-sans flex flex-col min-h-screen">
      <Header />
      <div className="container grow flex flex-col mx-auto p-4 md:px-0">
        <p className="py-4">
          {t('resume.description')}
        </p>
        <main className="grow">
          <p>{t('resume.howItWorks')}</p>
          <div className='py-4 flex justify-center items-center'>
            <div className="mx-2 text-white rounded bg-light-marine hover:bg-dark-marine">
              <Link className="block px-4 py-2" href="/resume/full">{t('resume.fullCTA')}</Link>
            </div>
            <div className="mx-2 text-white rounded bg-light-marine hover:bg-dark-marine">
              <Link className="block px-4 py-2" href="/resume/developer">{t('resume.developerCTA')}</Link>
            </div>
            <div className="mx-2 text-white rounded bg-light-marine hover:bg-dark-marine">
              <Link className="block px-4 py-2" href="/resume/manager">{t('resume.managerCTA')}</Link>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default HomePage
