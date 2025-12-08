import { Container, Grid, GridItem, Heading, HStack, Separator, Timeline, VStack } from '@chakra-ui/react';
import { createFileRoute, ErrorComponent } from '@tanstack/react-router';
import React from 'react';

import { Experience } from '@/components/resume/experience';
import Footer from '@/components/resume/footer';
import Header from '@/components/resume/header';
import Project from '@/components/resume/project';
import type {TExperience, TProject} from '@/components/resume/types';
import { TaskTypeZodType   } from '@/components/resume/types';
import { m } from '@/paraglide/messages';

const buildExperiences = () => {
  return {
    title: m['resume.content.experiences.title'](),
    current: {
      title: m['resume.content.experiences.current.title'](),
      period: m['resume.content.experiences.current.period'](),
      links: [
        m['resume.content.experiences.current.links.0'](),
        m['resume.content.experiences.current.links.1']()
      ],
      tasks: [],
      productGoal: m['resume.content.experiences.current.productGoal'](),
      myRole: m['resume.content.experiences.current.myRole'](),
    },
    past: [
      {
        title: m['resume.content.experiences.past.1.title'](),
        period: m['resume.content.experiences.past.1.period'](),
        links: [
          m['resume.content.experiences.past.1.links.0'](),
        ],
        tasks: [],
        productGoal: m['resume.content.experiences.past.1.productGoal'](),
        myRole: m['resume.content.experiences.past.1.myRole'](),
      },
      {

        title: m['resume.content.experiences.past.2.title'](),
        period: m['resume.content.experiences.past.2.period'](),
        links: [
          m['resume.content.experiences.past.2.links.0'](),
        ],
        tasks: [],
        productGoal: m['resume.content.experiences.past.2.productGoal'](),
        myRole: m['resume.content.experiences.past.2.myRole'](),
      },
      {
        title: m['resume.content.experiences.past.3.title'](),
        period: m['resume.content.experiences.past.3.period'](),
        links: [
          m['resume.content.experiences.past.3.links.0'](),
        ],
        tasks: [],
        myRole: m['resume.content.experiences.past.3.myRole'](),
      },
      {
        title: m['resume.content.experiences.past.4.title'](),
        period: m['resume.content.experiences.past.4.period'](),
        links: [
          m['resume.content.experiences.past.4.links.0'](),
          m['resume.content.experiences.past.4.links.1']()
        ],
        tasks: [],
        myRole: m['resume.content.experiences.past.4.myRole'](),
      },
      {
        title: m['resume.content.experiences.past.5.title'](),
        period: m['resume.content.experiences.past.5.period'](),
        links: [
          m['resume.content.experiences.past.5.links.0'](),
        ],
        tasks: [],
        myRole: m['resume.content.experiences.past.5.myRole'](),
      }
    ]
  } satisfies {
    title: string;
    current: TExperience;
    past: TExperience[];
  };
};

const buildProjects = () => {
  return {
    title: m['resume.content.projects.title'](),
    current: [
      {
        title: m['resume.content.projects.current.0.title'](),
        period: m['resume.content.projects.current.0.period'](),
        links: [
          m['resume.content.projects.current.0.links.0'](),
        ],
        tasks: [
          {
            type: TaskTypeZodType.parse(m["resume.content.projects.current.0.tasks.0.type"]()),
            text: m["resume.content.projects.current.0.tasks.0.text"]()
          },
        ],
      },
      {
        title: m['resume.content.projects.current.1.title'](),
        period: m['resume.content.projects.current.1.period'](),
        links: [
          m['resume.content.projects.current.1.links.0'](),
        ],
        tasks: [
          {
            type: TaskTypeZodType.parse(m["resume.content.projects.current.1.tasks.0.type"]()),
            text: m["resume.content.projects.current.1.tasks.0.text"]()
          },
        ],
      },
    ],
  } satisfies {
    title: string;
    current: TProject[];
  };
};

export const Route = createFileRoute('/resume')({
  component: Resume,
  errorComponent: ({ error }) => {
    return <ErrorComponent error={error} />;
  }
});

function Resume () {
  const experiences = buildExperiences();
  const projects = buildProjects();

  return <Container py={6} flex="1">
    <VStack alignItems="start">
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
  </Container>;
}
