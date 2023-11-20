'use client'

import React from 'react'

import Header from '../components/header'
import Footer from '../components/footer'
import { useTranslation } from 'react-i18next'
import useCategory from '../hooks/useCategory'
import ExperienceIcon from '../../components/images/experience-icon'
import StudyIcon from '../../components/images/study-icon'
import AchievementIcon from '../../components/images/achievement-icon'
import MiscIcon from '../../components/images/misc-icon'
import ProjectIcon from '../../components/images/project-icon'

function HomePage () {
  const { t } = useTranslation()
  const experiences = useCategory('experiences', ExperienceIcon, 'Development')
  const studies = useCategory('studies', StudyIcon)
  const achievements = useCategory('achievements', AchievementIcon)
  const projects = useCategory('projects', ProjectIcon)
  const misc = useCategory('misc', MiscIcon)

  return (
    <div className="font-sans">
      <Header />
      <div className="md:container mx-auto p-4 md:px-0">
        <p className="py-4 print:text-sm">
          {t('resume.description')}
        </p>
        <main>
          {experiences}
          <div className="flex flex-col md:flex-row print:flex-row">
            <div className="w-auto md:w-1/2 print:w-1/2 md:mr-5">
              {studies}
              {achievements}
            </div>
            <div className="w-auto md:w-1/2 print:w-1/2 md:ml-5">
              {projects}
              {misc}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default HomePage
