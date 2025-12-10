import { Heading, HStack,List } from '@chakra-ui/react';
import React from 'react';
import { LuExternalLink } from 'react-icons/lu';

import { ExternalLink } from '@/components/Link';
import { m } from '@/paraglide/messages';

function Footer () {
  return (
    <footer>
      <HStack>
        <Heading as="h3">{m['resume_copy']()}</Heading>
        <List.Root variant="plain" display="flex" flexDir="row">
          <List.Item>
            <ExternalLink href="https://github.com/faxaq/website" rel="noopener noreferrer" target="_blank">Github<LuExternalLink /></ExternalLink>
          </List.Item>
        </List.Root>
      </HStack>
    </footer>
  );
}

export default Footer;
