import { Box, Button } from '@chakra-ui/react';
import React, { useState } from 'react';

import TunerContainer from './TunerContainer';

const Tuner = () => {
  const [audioStream, setAudioStream] = useState<MediaStream | undefined>();

  async function requestMicAccess() {
    try {
      setAudioStream(await navigator.mediaDevices.getUserMedia({ audio: true }));
    } catch (err) {
      console.error(err);
    }
  }

  return <Box rounded="md" p={6} border="1px solid" width="100%">
    {audioStream !== undefined
      ? <TunerContainer audioStream={audioStream} />
      : <Button onClick={async () => requestMicAccess()} cursor="pointer">Request mic access</Button>
    }
  </Box>;
};

export default Tuner;
