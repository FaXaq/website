'use client'

import React from 'react'
import { Heading, HStack, List, VStack } from '@chakra-ui/react'
import { Link } from '@/components/Link'
import { LuExternalLink } from 'react-icons/lu'

function Footer() {
  return (
    <footer>
      <VStack alignItems="start">
        <HStack>
          <Heading as="h3" fontSize="lg">Made with :</Heading>
          <List.Root variant="plain" display="flex" flexDir="row">
            <List.Item><Link href="https://turfjs.org/" target="_blank" rel="noreferrer">turf.js<LuExternalLink /></Link></List.Item>
            <List.Item><Link href="https://www.openstreetmap.org" target="_blank" rel="noreferrer">openstreetmap<LuExternalLink /></Link></List.Item>
            <List.Item><Link href="https://leafletjs.com/" target="_blank" rel="noreferrer">leaflet<LuExternalLink /></Link></List.Item>
            <List.Item><Link href="https://nominatim.org/" target="_blank" rel="noreferrer">nominatim<LuExternalLink /></Link></List.Item>
          </List.Root>
        </HStack>
        <HStack>
          <Heading as="h3" fontSize="lg ">Links :</Heading>
          <List.Root variant="plain" display="flex" flexDir="row">
            <List.Item><Link href="https://github.com/FaXaq/website/tree/master/app/projects/corsica" target="_blank" rel="noreferrer">Code on Github<LuExternalLink /></Link></List.Item>
          </List.Root>
        </HStack>
      </VStack>
    </footer>
  )
}

export default Footer
