'use client'

import React from 'react'

import Header from './components/header'
import Footer from './components/footer'
import { useTranslation } from 'react-i18next'
import { Grid, GridItem, Heading, HStack, Separator, Timeline, useBreakpoint, useBreakpointValue, VStack } from '@chakra-ui/react'
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
      <Grid templateColumns="repeat(5, 1fr)">
        <GridItem colSpan={{ base: 5, lg: 4}}>
          <VStack alignItems="start">
            <Heading as="h3" mt={4} mb={2}>{experiences.title}</Heading>
            <Timeline.Root>
              <Experience experience={experiences.current}/>
              {experiences.past.map(experience => (
                <Experience key={experience.title} experience={experience} />
              ))}
            </Timeline.Root>
          </VStack>
        </GridItem>
        <GridItem colSpan={{ base: 5, lg: 1 }} pb={{ base: 4, lg: 0 }}>
          <HStack h="100%" alignItems="start">
            <Separator orientation={"vertical"} display={{ base: "none", sm: "block" }} h="full" m={5} />
            <VStack width="100%" justifyContent="start" alignItems="start">
              <Heading as="h3" mt={4} mb={2}>{projects.title}</Heading>
              {projects.current.map(project => (
                <Project project={project} key={project.title} />
              ))}
            </VStack>
          </HStack>
        </GridItem>
      </Grid>
      <Footer />
    </VStack>
  </VStack>
}

export default HomePage
