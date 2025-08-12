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
  const experiences = useCategory('experiences', ExperienceIcon, 'Management')
  const studies = useCategory('studies', StudyIcon)
  const achievements = useCategory('achievements', AchievementIcon)
  const projects = useCategory('projects', ProjectIcon)
  const misc = useCategory('misc', MiscIcon)

  return (
    <div >
      <Header />
      <div >
        <p >
          {t('resume.description')}
        </p>
        <main>
          {experiences}
          <div >
            <div >
              {studies}
              {achievements}
            </div>
            <div >
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
