import { Heading, List, VStack } from '@chakra-ui/react';
import { LuExternalLink } from 'react-icons/lu';

import { ExternalLink } from '@/components/Link';

function MTTSFooter () {
  return (
    <footer>
      <VStack alignItems="start">
        <Heading as="h3" fontSize="lg">Made with :</Heading>
        <List.Root variant="plain" display="flex" flexDir="row" flexWrap="wrap" gap={2}>
          <List.Item><ExternalLink href="https://github.com/faxaq/mtts" target="_blank" rel="noreferrer">MTTS<LuExternalLink /></ExternalLink></List.Item>
          <List.Item><ExternalLink href="https://tonejs.github.io/" target="_blank" rel="noreferrer">Tone.js<LuExternalLink /></ExternalLink></List.Item>
        </List.Root>
        <Heading as="h3" fontSize="lg ">Links :</Heading>
        <List.Root variant="plain" display="flex" flexDir="row" gap={2}>
          <List.Item><ExternalLink href="https://github.com/faxaq/mtts" target="_blank" rel="noreferrer">Library code<LuExternalLink /></ExternalLink></List.Item>
          <List.Item><ExternalLink href="https://github.com/faxaq/website/tree/master/app/projects/mtts" target="_blank" rel="noreferrer">Website code<LuExternalLink /></ExternalLink></List.Item>
        </List.Root>
      </VStack>
    </footer>
  );
}

export default MTTSFooter;
