'use client'

import React from 'react'

import Header from './components/header'
import Footer from './components/footer'
import { useTranslation } from 'react-i18next'
import { Heading, HStack, Separator, Timeline, VStack } from '@chakra-ui/react'
import { ExperiencesZodType, ProjectsZodType } from './types'
import { Experience } from './components/experience'
import Project from './components/project'

function HomePage () {
  const { t } = useTranslation()
  const experiences = ExperiencesZodType.parse(t('resume.content.experiences'))
  const projects = ProjectsZodType.parse(t('resume.content.projects'))

  return <VStack alignItems="start">
    <Header />
    <VStack alignItems="start" justifyContent="space-between">
      <HStack align="stretch">
        <VStack width={{ base: "100%", md: "80%" }} alignItems="start">
          <Heading as="h3" mt={4} mb={2}>{experiences.title}</Heading>
          <Timeline.Root>
            <Experience experience={experiences.current}/>
            {experiences.past.map(experience => (
              <Experience key={experience.title} experience={experience} />
            ))}
          </Timeline.Root>
        </VStack>
        <Separator mx={8} my={8} orientation={"vertical"} />
        <VStack width={{ base: "100%", md: "20%" }} justifyContent="start" alignItems="start">
          <Heading as="h3" mt={4} mb={2}>{projects.title}</Heading>
          {projects.current.map(project => (
            <Project project={project} key={project.title} />
          ))}
        </VStack>
      </HStack>
      <Footer />
    </VStack>
  </VStack>
}

export default HomePage
