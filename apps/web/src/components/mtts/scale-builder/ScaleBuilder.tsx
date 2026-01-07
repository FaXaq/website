import { Box, Card, createListCollection, Em, Grid, GridItem, Heading, HStack, List, Portal, RadioGroup, Select, Span, Text, VStack } from '@chakra-ui/react';
import type { Chord as MTTSChord } from '@repo/mtts';
import { Interval, INTERVAL_NAMES, INTERVALS, Note, Scale, SCALE_NAMES, SCALES } from '@repo/mtts';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useMemo, useState } from 'react';

import GuitarNeck from '@/components/mtts/guitar/guitar-neck';

import Chord from './Chord';
import ColorButton from './ColorButton';
import { NOTE_DISPLAY, useScaleBuilderSettings } from './context/settings';
import Fret from './Fret';
import { COLOR } from './helpers/getNoteColor';
import { isSameChord } from './helpers/isSameChord';
import { noteExistsInChord } from './helpers/noteExistsInChord';
import { useNoteTranslation } from './hooks/useNoteTranslation';
import { availableRootNotes, INTERVAL_COLORS } from './utils';

export function ScaleBuilder() {
  const searchParams = useSearch({ from: '/projects/mtts/scale-builder' });
  const navigate = useNavigate({ from: '/projects/mtts/scale-builder' });
  const rootNote = Note.fromSPN(searchParams.rootNote);
  const [selectedChord, setSelectedChord] = useState<MTTSChord | null>(null);
  const scaleIntervals = searchParams.scaleIntervals.map((interval) => Interval.fromName(interval));
  const { noteDisplay, setNoteDisplay } = useScaleBuilderSettings();
  const { translateNote } = useNoteTranslation();

  const scale = new Scale({ key: rootNote, intervals: scaleIntervals });

  const availableIntervals: {
    [key: number]: Interval[]
  } = useMemo(() => {
    const intervals: { [key: number]: Interval[] } = {};
    INTERVAL_NAMES
      .filter(i => INTERVALS[i].semitones < 12 && INTERVALS[i].value < 8)
      .forEach(interval => {
        const intervalNumber = parseInt(interval.replace(/[a-zA-Z]/, ''));
        if (!intervals[intervalNumber]) {
          intervals[intervalNumber] = [];
        }

        try {
          Interval.apply(rootNote, interval);
          intervals[intervalNumber].push(Interval.fromName(interval));
        } catch (_e) {
          // fails silently
        }
      });
    return intervals;
  }, [rootNote]);

  function getIntervalIndexInScale(interval: Interval) {
    return scaleIntervals.findIndex(si => interval.name === si.name);
  }

  function toggleScaleInterval(interval: Interval) {
    const intervalIndexInScale = getIntervalIndexInScale(interval);
    if (intervalIndexInScale > -1) {
      navigate({
        search: (prev) => ({
          ...prev,
          scaleIntervals: scaleIntervals.filter(si => si.name !== interval.name).map(si => si.name)
        })
      });
    } else {
      navigate({
        search: (prev) => ({
          ...prev,
          scaleIntervals: [...scaleIntervals.map(si => si.name), interval.name]
        })
      });
    }
  }

  const scaleTitle = useMemo(() => {
    if (rootNote && scale) {
      return `${translateNote(rootNote)} ${scale?.name || scale.mode ? scale.name : `(${scale.intervals.map(interval => `${interval.name}`)})`} ${scale.mode && `/ ${translateNote(rootNote)} ${scale.mode}`}`;
    }
  }, [scale, rootNote]);

  const rootNoteOptions = createListCollection({
    items: availableRootNotes.map((note) => ({
      label: translateNote(note),
      value: note.SPN
    }))
  });

  const scaleOptions = createListCollection({
    items: SCALE_NAMES.map(s => ({
      label: s,
      value: s
    }))
  });

  const selectChord = (chord: MTTSChord) => {
    if (isSameChord(chord, selectedChord)) {
      setSelectedChord(null);
    } else {
      setSelectedChord(chord);
    }
  };

  return (
    <Box>
      <VStack alignItems="start" gap={6}>
        <Heading as="h2">Scale Builder</Heading>
        <Grid templateColumns="repeat(4, 1fr)" gap={4}>
          <GridItem colSpan={{ base: 4, md: 1 }}>
            <Select.Root
              collection={rootNoteOptions}
              size="xs"
              value={[rootNoteOptions.items.find((option) => option.value === rootNote.SPN)?.value ?? Note.fromSPN('C').SPN]}
              onValueChange={async (e) => navigate({
                search: (prev) => ({ ...prev, rootNote: e.value[0] ?? new Note().SPN })
              })}
              multiple={false}
            >
              <Select.HiddenSelect />
              <Select.Label>Select root note</Select.Label>
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Select root note" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {rootNoteOptions.items.map((option) => (
                      <Select.Item item={option} key={option.value}>
                        {option.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
            <Select.Root
              collection={scaleOptions}
              size="xs"
              width="320px"
              value={[scale?.name?.toUpperCase() ?? '']}
              onValueChange={(e) => {
                const val = e.value[0] as keyof typeof SCALES;
                if (val && SCALES[val]) {
                  const scale = SCALES[val];
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      scaleIntervals: scale.intervals.map(i => i.name)
                    })
                  });
                }
              }}
              multiple={false}
            >
              <Select.HiddenSelect />
              <Select.Label>Select a scale</Select.Label>
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Select a scale" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {scaleOptions.items.map((option) => (
                      <Select.Item item={option} key={option.value}>
                        {option.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
            <Text fontSize="sm">Here are the intervals you're working with. You can click to add or remove some if you want to experiment.</Text>
            <List.Root variant="plain" display="flex" flexDir="row" gap={1} py={1}>
              {Object.keys(availableIntervals).map((intervalKey) =>
                <List.Item key={intervalKey}>
                  <List.Root variant="plain" display="flex" flexDir="column" gap={1}>
                    {(availableIntervals[parseInt(intervalKey)] as Interval[]).map(interval => (
                      <List.Item key={`${intervalKey}-${interval.name}`}>
                        <ColorButton
                          color={INTERVAL_COLORS[interval.value - 1] ?? COLOR.DEFAULT}
                          isActive={getIntervalIndexInScale(interval) > -1}
                          onClick={() => toggleScaleInterval(interval)}
                        >
                          <Span fontSize="xs">{interval.name}</Span>
                        </ColorButton>
                      </List.Item>))}
                  </List.Root>
                </List.Item>
              )}
            </List.Root>
          </GridItem>
          <GridItem colSpan={{ base: 4, md: 3 }}>
            <Card.Root shadow="md">
              <Card.Body gap="2">
                <Card.Title mt="2">{scaleTitle}</Card.Title>
                <Card.Description as="div">
                  <VStack alignItems="start">
                    <Text>This scale contains the following notes: <Em>{scale?.notes.map(note => translateNote(note)).join(", ")}</Em></Text>
                    {scale?.diatonicChords?.length && scale?.diatonicChords?.length > 0 && (
                      <>
                        <Span>I have extracted the following diatonic chords:</Span>
                        <HStack flexWrap="wrap">
                          {scale?.diatonicChords.map(({ chord, degree }) =>
                            chord.notation && (
                              <Chord key={`${chord.root.name}${chord.notation}`} chord={chord} degree={degree} scale={scale} onClick={selectChord} highlighted={isSameChord(chord, selectedChord)} />
                            )
                          )}
                        </HStack>
                      </>
                    )}
                  </VStack>
                </Card.Description>
              </Card.Body>
            </Card.Root>
          </GridItem>
          <GridItem colSpan={4}>
            <p>Select how you want to show the notes on the fretboard</p>
            <RadioGroup.Root defaultValue="1" value={noteDisplay} onValueChange={(e) => setNoteDisplay(e.value as NOTE_DISPLAY)} size="sm">
              <HStack gap="6">
                {Object.values(NOTE_DISPLAY).map(displaySetting => (
                  <RadioGroup.Item key={displaySetting} value={displaySetting}>
                    <RadioGroup.ItemHiddenInput />
                    <RadioGroup.ItemIndicator />
                    <RadioGroup.ItemText>{displaySetting}</RadioGroup.ItemText>
                  </RadioGroup.Item>
                ))}
              </HStack>
            </RadioGroup.Root>
          </GridItem>
          <GridItem colSpan={4}>
            <Text>Here is the scale on a guitar neck :</Text>
            <Box>
              <GuitarNeck
                layout='horizontal'
                highlightFret={({ note }) => selectedChord ? noteExistsInChord(selectedChord, note) : true}
                getFret={(props) =>
                  <Fret
                    {...props}
                    scale={scale ?? new Scale()}
                  />
                }
              />
            </Box>
          </GridItem>
          {/*<GridItem colSpan={4}>
            <Text>Here is the scale on a piano :</Text>
            <Box h="32">
              <PianoRoll scale={scale} PianoBlackKeyComponent={PianoBlackKey} PianoKeyComponent={PianoKey} />
            </Box>
          </GridItem>*/}
        </Grid>
      </VStack>
    </Box>
  );
}
