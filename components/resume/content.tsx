import React from 'react'
import useCategory from '../../hooks/resume/category'
import ExperienceIcon from '../images/experience-icon'
import StudyIcon from '../images/study-icon'
import AchievementIcon from '../images/achievement-icon'
import MiscIcon from '../images/misc-icon'
import ProjectIcon from '../images/project-icon'

function Content () {
  const experiences = useCategory('experiences', ExperienceIcon)
  const studies = useCategory('studies', StudyIcon)
  const achievements = useCategory('achievements', AchievementIcon)
  const projects = useCategory('projects', ProjectIcon)
  const misc = useCategory('misc', MiscIcon)

  return (
    <main>
      {experiences}
      <div className="flex flex-col md:flex-row">
        <div className="w-auto md:w-1/2 md:mr-5">
          {studies}
          {achievements}
        </div>
        <div className="w-auto mdw-1/2 md:ml-5">
          {projects}
          {misc}
        </div>
      </div>
    </main>
  )
}

export default Content
