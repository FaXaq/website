'use client'

import { Link } from '@/components/Link'
import { Heading, List, VStack } from '@chakra-ui/react'
import React from 'react'
import { LuExternalLink } from 'react-icons/lu'

function MTTSFooter () {
  return (
    <footer>
      <VStack alignItems="start">
        <Heading as="h3" fontSize="lg">Made with :</Heading>
        <List.Root variant="plain" display="flex" flexDir="row" flexWrap="wrap" gap={2}>
          <List.Item><Link href="https://github.com/faxaq/mtts" target="_blank" rel="noreferrer">MTTS<LuExternalLink /></Link></List.Item>
          <List.Item><Link href="https://tonejs.github.io/" target="_blank" rel="noreferrer">Tone.js<LuExternalLink /></Link></List.Item>
        </List.Root>
        <Heading as="h3" fontSize="lg ">Links :</Heading>
        <List.Root variant="plain" display="flex" flexDir="row" gap={2}>
          <List.Item><Link href="https://github.com/faxaq/mtts" target="_blank" rel="noreferrer">Library code<LuExternalLink /></Link></List.Item>
          <List.Item><Link href="https://github.com/faxaq/website/tree/master/app/projects/mtts" target="_blank" rel="noreferrer">Website code<LuExternalLink /></Link></List.Item>
        </List.Root>
      </VStack>
    </footer>
  )
}

export default MTTSFooter
