'use client'

import React from 'react'
import { useTranslation } from 'next-i18next'
import { Heading, HStack, List, Link as ChakraLink } from '@chakra-ui/react'
import NextLink from "next/link"
import { LuExternalLink } from 'react-icons/lu'
import { TProject } from '../types'

function Project ({ project }: { project: TProject }) {
  const { t } = useTranslation()
  return (
    <HStack>
      <Heading>{project.title}</Heading>
    </HStack>
  )
}

export default Project
