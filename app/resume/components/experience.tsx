import { Timeline, Link as ChakraLink, Text, Em, Span } from "@chakra-ui/react"
import { TExperience } from "../types"
import { LuExternalLink } from "react-icons/lu"
import NextLink from "next/link"
import ExperienceIcon from "@/components/images/experience-icon"
import { useTranslation } from "react-i18next"


export const Experience = ({ experience }: { experience: TExperience }) => {
  const { t } = useTranslation()

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
          <ChakraLink key={l} as={NextLink} href={l} pr={2} color="fg.info" target="_blank">
            {l.replace("https://","")}<LuExternalLink />
          </ChakraLink>
        )}
        </Timeline.Description>
        { experience.productGoal && (
          <Text textStyle="sm">
            <Span fontWeight="medium">{t('resume.content.experiences.theProduct')}</Span> {experience.productGoal}
          </Text>
        )}
        <Text textStyle="sm">
          {
            // if there is no product goal, treat my role as a general description
          }
          {experience.productGoal && (<Span fontWeight="medium">{t('resume.content.experiences.myRole')}</Span> )}{experience.myRole}
        </Text>
      </Timeline.Content>
    </Timeline.Item>
  )
}