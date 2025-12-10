import { Span,Text, Timeline } from "@chakra-ui/react";
import { LuExternalLink } from "react-icons/lu";

import ExperienceIcon from "@/components/images/experience-icon";
import { ExternalLink } from "@/components/Link";
import { m } from "@/paraglide/messages";

import type { TExperience } from "./types";


export const Experience = ({ experience }: { experience: TExperience }) => {
  return (
    <Timeline.Item>
      <Timeline.Connector>
        <Timeline.Separator />
        <Timeline.Indicator bg="bg.subtle" border="transparent" borderImageWidth={0}>
          <ExperienceIcon />
        </Timeline.Indicator>
      </Timeline.Connector>
      <Timeline.Content>
        <Timeline.Title fontSize="md">{experience.title}</Timeline.Title>
        <Timeline.Description>{experience.period} - {experience.links.map(l =>
          <ExternalLink key={l} href={l} pr={2} color="fg.info" target="_blank">
            {l.replace("https://","")}<LuExternalLink />
          </ExternalLink>
        )}
        </Timeline.Description>
        { experience.productGoal && (
          <Text textStyle="sm">
            <Span fontWeight="medium">{m['resume_content_experiences_theProduct']()}</Span> {experience.productGoal}
          </Text>
        )}
        <Text textStyle="sm">
          {
            // if there is no product goal, treat my role as a general description
          }
          {experience.productGoal && (<Span fontWeight="medium">{m['resume_content_experiences_myRole']()}</Span> )}{experience.myRole}
        </Text>
      </Timeline.Content>
    </Timeline.Item>
  );
};