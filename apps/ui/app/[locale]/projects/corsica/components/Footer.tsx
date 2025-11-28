'use client';

import { Heading, List, VStack } from '@chakra-ui/react';
import React from 'react';
import { LuExternalLink } from 'react-icons/lu';

import { Link } from '@/components/Link';

function Footer() {
  return (
    <footer>
      <VStack alignItems="start">
        <Heading as="h3" fontSize="lg">Made with :</Heading>
        <List.Root variant="plain" display="flex" flexDir="row" flexWrap="wrap" gap={2}>
          <List.Item><Link href="https://turfjs.org/" target="_blank" rel="noreferrer">turf.js<LuExternalLink /></Link></List.Item>
          <List.Item><Link href="https://www.openstreetmap.org" target="_blank" rel="noreferrer">openstreetmap<LuExternalLink /></Link></List.Item>
          <List.Item><Link href="https://leafletjs.com/" target="_blank" rel="noreferrer">leaflet<LuExternalLink /></Link></List.Item>
          <List.Item><Link href="https://nominatim.org/" target="_blank" rel="noreferrer">nominatim<LuExternalLink /></Link></List.Item>
        </List.Root>
        <Heading as="h3" fontSize="lg ">Links :</Heading>
        <List.Root variant="plain" display="flex" flexDir="row">
          <List.Item><Link href="https://github.com/FaXaq/website/tree/master/app/projects/corsica" target="_blank" rel="noreferrer">Code on Github<LuExternalLink /></Link></List.Item>
        </List.Root>
      </VStack>
    </footer>
  );
}

export default Footer;
