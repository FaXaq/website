'use client';

import { Box, Button,Card, GridItem, Heading, HStack, Separator, Slider, Span, Text, VStack } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import * as Tone from 'tone';

import { useVolume } from '../hooks/tonejs';
import useMetronome from '../hooks/useMetronome/useMetronome';

function Metronome() {
  const [previousTap, setPreviousTap] = useState<number>(0);
  const [beatNumber, setBeatNumber] = useState<number>(4);
  const [synth, setSynth] = useState<Tone.Synth>();
  const [metronomeBeat, setMetronomeBeat] = useState<number>(0);
  const { db, setDb } = useVolume(0);

  const onBip = useCallback((metronomeBeat: number) => {
    if (synth) {
      if (metronomeBeat % beatNumber === 0) {
        synth.triggerAttackRelease("A4", "16n");
      } else {
        synth.triggerAttackRelease("C4", "16n");
      }
    }
    setMetronomeBeat((metronomeBeat) % beatNumber);
  }, [synth, beatNumber]);

  const { bpm, updateBpm, toggleMetronome, isActive } = useMetronome(onBip);
  const delay = (Math.round(60000 * 100 / bpm) / 100).toFixed(2);

  function triggerTap() {
    const now = Date.now();
    const diff = now - previousTap;
    if (diff < 2000 && diff > 200) {
      updateBpm(Math.round((60 / diff) * 1000));
    }
    setPreviousTap(now);
  }

  useEffect(() => {
    const s = new Tone.Synth().toDestination();
    s.volume.setValueAtTime(db, Tone.now());
    setSynth(s);
  }, []);

  useEffect(() => {
    if (synth) {
      synth.volume.rampTo(db, 0.05);
    }
  }, [db, synth]);

  const percentToDb = (percent: number) => {
    return ((percent - percent / 10) / 3) - 15;
  };

  const dbToPercent = (db: number) => {
    return (30 * (db + 15))/ 9;
  };

  return (
    <VStack gap={2} w="full" alignItems="stretch">
      <Heading as="h1">
        <Trans>Metronome</Trans>
      </Heading>
      <Card.Root fontFamily="mono">
        <Card.Body>
          <VStack gap={4}>
            <HStack gap={2}>
              <HStack gap={0}>
                <Box w={100} textAlign="center" borderWidth="1px" borderColor="border.muted" borderRadius="md" p={2} bg="bg.emphasized">
                  <Heading as="h2" fontSize="xl">Tempo</Heading>
                  <Text fontSize="2xl">{bpm}<Span fontSize="md" pl={1}>bpm</Span></Text>
                  <Text fontSize="xs">delay {delay}ms</Text>
                </Box>
                <VStack ml={-2}>
                  <Button onClick={() => updateBpm(bpm + 1)} size="xs" variant="outline" bg={{ base: "bg.subtle", _hover: "bg.emphasized" }}>+</Button>
                  <Button onClick={() => triggerTap()} rounded="full" variant="outline" bg={{ base: "bg.subtle", _hover: "bg.emphasized" }}><Trans>Tap</Trans></Button>
                  <Button onClick={() => updateBpm(bpm - 1)} size="xs" variant="outline" bg={{ base: "bg.subtle", _hover: "bg.emphasized" }}>-</Button>
                </VStack>
              </HStack>
              <Separator orientation="vertical" variant="solid" mr={2} ml={1} h="28" />
              <VStack gap={2}>
                <Heading as="h2" fontSize="xl"><Trans>Beats</Trans></Heading>
                <HStack w="full">
                  <Button onClick={() => setBeatNumber(beatNumber > 0 ? beatNumber - 1 : 0)} size="xs" variant="outline" bg={{ base: "bg.subtle", _hover: "bg.emphasized" }}>-</Button>
                  <Text fontSize="2xl">{beatNumber}</Text>
                  <Button onClick={() => setBeatNumber(beatNumber + 1)} size="xs" variant="outline" bg={{ base: "bg.subtle", _hover: "bg.emphasized" }}>+</Button>
                </HStack>
              </VStack>
              <Separator orientation="vertical" variant="solid" h="28" />
              <Box h="full">
                <Slider.Root value={[dbToPercent(db)]} size="sm" onValueChange={(d) => {
                  setDb(percentToDb(d.value[0]));
                }} onDoubleClick={() => setDb(0)} orientation="vertical" h="full">
                  <Slider.Control>
                    <Slider.Track>
                      <Slider.Range />
                    </Slider.Track>
                    <Slider.Thumbs />
                  </Slider.Control>
                </Slider.Root>
              </Box>
            </HStack>
            <Separator w="full" />
            <HStack flexWrap="wrap">
            {
              Array.from({ length: beatNumber }).fill(0).map((_, index) => (
                <GridItem key={`beat-${index}`} display="inline-block" mx="2" h={50} w={50} bg={metronomeBeat === index ? "red.400" : "bg.muted"}>
                </GridItem>
              ))
            }
            </HStack>
            <Button onClick={() => toggleMetronome()}>
              <Trans>{ isActive ? "Stop" : "Start" }</Trans>
            </Button>
          </VStack>
        </Card.Body>
      </Card.Root>
    </VStack>
  );
}

export default dynamic(
  async () => Promise.resolve(Metronome),
  {
    ssr: false
  }
);