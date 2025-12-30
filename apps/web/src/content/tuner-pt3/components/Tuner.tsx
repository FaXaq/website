import { Box, Button } from '@chakra-ui/react';
import { useState } from 'react';

import TunerContainer from './TunerContainer';

export default function Tuner() {
  const [audioStream, setAudioStream] = useState<MediaStream | undefined>();

  async function requestMicAccess() {
    try {
      setAudioStream(await navigator.mediaDevices.getUserMedia({ audio: true }));
    } catch (err) {
      console.error(err);
    }
  }

  return <Box p={6} rounded="md" border="1px solid">{
    audioStream !== undefined
    ? <TunerContainer audioStream={audioStream} />
    : <Button onClick={async () => requestMicAccess()}>Request mic access</Button>
  }</Box>;
}
