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
    title: m['resume_content_experiences_title'](),
    current: {
      title: m['resume_content_experiences_current_title'](),
      period: m['resume_content_experiences_current_period'](),
      links: [
        m['resume_content_experiences_current_links_0'](),
        m['resume_content_experiences_current_links_1']()
      ],
      tasks: [],
      productGoal: m['resume_content_experiences_current_productGoal'](),
      myRole: m['resume_content_experiences_current_myRole'](),
    },
    past: [
      {
        title: m['resume_content_experiences_past_1_title'](),
        period: m['resume_content_experiences_past_1_period'](),
        links: [
          m['resume_content_experiences_past_1_links_0'](),
        ],
        tasks: [],
        productGoal: m['resume_content_experiences_past_1_productGoal'](),
        myRole: m['resume_content_experiences_past_1_myRole'](),
      },
      {

        title: m['resume_content_experiences_past_2_title'](),
        period: m['resume_content_experiences_past_2_period'](),
        links: [
          m['resume_content_experiences_past_2_links_0'](),
        ],
        tasks: [],
        productGoal: m['resume_content_experiences_past_2_productGoal'](),
        myRole: m['resume_content_experiences_past_2_myRole'](),
      },
      {
        title: m['resume_content_experiences_past_3_title'](),
        period: m['resume_content_experiences_past_3_period'](),
        links: [
          m['resume_content_experiences_past_3_links_0'](),
        ],
        tasks: [],
        myRole: m['resume_content_experiences_past_3_myRole'](),
      },
      {
        title: m['resume_content_experiences_past_4_title'](),
        period: m['resume_content_experiences_past_4_period'](),
        links: [
          m['resume_content_experiences_past_4_links_0'](),
          m['resume_content_experiences_past_4_links_1']()
        ],
        tasks: [],
        myRole: m['resume_content_experiences_past_4_myRole'](),
      },
      {
        title: m['resume_content_experiences_past_5_title'](),
        period: m['resume_content_experiences_past_5_period'](),
        links: [
          m['resume_content_experiences_past_5_links_0'](),
        ],
        tasks: [],
        myRole: m['resume_content_experiences_past_5_myRole'](),
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
    title: m['resume_content_projects_title'](),
    current: [
      {
        title: m['resume_content_projects_current_0_title'](),
        period: m['resume_content_projects_current_0_period'](),
        links: [
          m['resume_content_projects_current_0_links_0'](),
        ],
        tasks: [
          {
            type: TaskTypeZodType.parse(m["resume_content_projects_current_0_tasks_0_type"]()),
            text: m["resume_content_projects_current_0_tasks_0_text"]()
          },
        ],
      },
      {
        title: m['resume_content_projects_current_1_title'](),
        period: m['resume_content_projects_current_1_period'](),
        links: [
          m['resume_content_projects_current_1_links_0'](),
        ],
        tasks: [
          {
            type: TaskTypeZodType.parse(m["resume_content_projects_current_1_tasks_0_type"]()),
            text: m["resume_content_projects_current_1_tasks_0_text"]()
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
