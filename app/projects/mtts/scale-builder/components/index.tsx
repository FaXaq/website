'use client'

import React, { useState, useEffect, useMemo, Suspense } from 'react'
import { Note, NOTES, ACCIDENTALS, Accidental, INTERVALS, Interval, ACCIDENTAL, Scale, SCALES } from 'mtts'
import GuitarNeck from '../../components/guitar/guitar-neck'
import Fret from './Fret'
import ColorButton from './ColorButton'
import { COLOR } from '../helpers/getNoteColor'
import { noteExistsInScale } from '../helpers/noteExistsInScale'
import Chord from './Chord'
import { useNoteTranslation } from '../hooks/useNoteTranslation'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import PianoRoll from '../../components/keys/PianoRoll'
import PianoBlackKey from './PianoBlackKey'
import PianoKey from './PianoKey'
import { NOTE_DISPLAY, ScaleBuilderSettingsProvider, useScaleBuilderSettings } from '../context/settings'
import { Box, Button, Card, createListCollection, Em, Grid, GridItem, Heading, HStack, List, Portal, RadioGroup, Select, Text, VStack } from '@chakra-ui/react'

const availableAccidentals: Accidental[] =
  ACCIDENTALS
    .filter(a => !a.includes('DOUBLE'))
    .map(a => new Accidental({ semitones: ACCIDENTAL[a] }))

const availableIntervals: {
  [key:number]: Interval[]
 } = (() => {
   const intervals: { [key:number]: Interval[] } = {}
   Object.keys(INTERVALS)
     .filter(i => INTERVALS[i].semitones < 12 && INTERVALS[i].value < 8)
     .forEach(interval => {
       const intervalNumber = interval.replace(/[a-zA-Z]/, '')
       if (!intervals[intervalNumber]) {
         intervals[intervalNumber] = []
       }

       intervals[intervalNumber].push(Interval.fromName(interval))
     })
   return intervals
 })()

const INTERVAL_COLORS = Object.values(COLOR)


const availableNotes: Note[] = NOTES.map(n => new Note({ name: n }))
const availableRootNotes: Note[] = []
availableNotes
  .forEach(note => {
    availableAccidentals
      .forEach(accidental => {
        availableRootNotes.push(new Note({
          name: note.name,
          accidental: new Accidental({ semitones: accidental.semitones })
        }))
      })
  })

const ROOT_NOTE_SEARCH_PARAMS_KEY = 'rootNote'
const SCALE_INTERVALS_SEARCH_PARAMS_KEY = 'intervals'

function BuildScale() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [rootNote, setRootNote] = useState<Note>(availableRootNotes[0])
  const [scaleIntervals, setScaleIntervals] = useState<Interval[]>(SCALES.MAJOR.intervals)
  const { noteDisplay, setNoteDisplay } = useScaleBuilderSettings()
  const { translateNote } = useNoteTranslation()

  const scale = useMemo(() => {
    try {
      return new Scale({ key: rootNote, intervals: scaleIntervals })
    } catch (err) {
      console.log(err)
    }
  }, [rootNote, scaleIntervals])

  const availableIntervals: {
    [key:number]: Interval[]
   } = useMemo(() => {
     const intervals: { [key:number]: Interval[] } = {}
     Object.keys(INTERVALS)
       .filter(i => INTERVALS[i].semitones < 12 && INTERVALS[i].value < 8)
       .forEach(interval => {
         const intervalNumber = interval.replace(/[a-zA-Z]/, '')
         if (!intervals[intervalNumber]) {
           intervals[intervalNumber] = []
         }

         try {
           Interval.apply(rootNote, interval)
           intervals[intervalNumber].push(Interval.fromName(interval))
         } catch (err) {}
       })
     return intervals
   }, [rootNote])

  function getIntervalIndexInScale(interval: Interval) {
    return scaleIntervals.findIndex(si => interval.name === si.name)
  }

  function toggleScaleInterval(interval: Interval) {
    const intervalIndexInScale = getIntervalIndexInScale(interval)
    if (intervalIndexInScale > -1) {
      setScaleIntervals(si => si.reduce((previous, current, interval) => {
        if (interval !== intervalIndexInScale) {
          return [...previous, current]
        }

        return [...previous]
      }, []))
    } else {
      setScaleIntervals(si => [...si, interval])
    }
  }

  useEffect(() => {
    const searchParamsRootNote = searchParams.get(ROOT_NOTE_SEARCH_PARAMS_KEY);
    const searchParamsScaleIntervals = searchParams.get(SCALE_INTERVALS_SEARCH_PARAMS_KEY)?.split(',');
    setRootNote(searchParamsRootNote ? Note.fromSPN(searchParamsRootNote) : availableRootNotes[0])
    setScaleIntervals(searchParamsScaleIntervals ? searchParamsScaleIntervals.map(interval => Interval.fromName(interval)) : SCALES.MAJOR.intervals)
  }, [])

  const scaleTitle = useMemo(() => {
    if (rootNote && scale) {
      return `${translateNote(rootNote)} ${scale.name || scale.mode ? scale.name : `(${scale.intervals.map(interval => `${interval.name}`)})`} ${scale.mode && `/ ${translateNote(rootNote)} ${scale.mode}`}`
    }
  }, [scale, rootNote])
  
  useEffect(() => {
    const newSearchParams = new URLSearchParams({
      [ROOT_NOTE_SEARCH_PARAMS_KEY]: rootNote.SPN,
      [SCALE_INTERVALS_SEARCH_PARAMS_KEY]: scaleIntervals.map(interval => interval.name).join(',')
    })

    router.push(pathname + '?' + newSearchParams.toString())
  }, [scaleIntervals, rootNote])

  const rootNoteOptions = createListCollection({
    items: availableRootNotes.map((note) => ({
      label: translateNote(note),
      value: note.SPN
    }))
  })

  const scaleOptions = createListCollection({
    items: Object.keys(SCALES).map(s => ({
      label: s,
      value: s
    }))
  })

  return (
    <Box>
      <VStack alignItems="start" gap={6}>
        <Heading as="h2">Scale Builder</Heading>
        <Grid templateColumns="repeat(4, 1fr)" gap={4}>
          <GridItem colSpan={{ base: 4, md: 1 }}>
            <Select.Root
              collection={rootNoteOptions}
              size="xs"
              value={[rootNoteOptions.items.find((option) => option.value === rootNote.SPN).value]}
              onValueChange={(e) => setRootNote(Note.fromSPN(e.value[0]))}
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
              value={[scale?.name.toUpperCase()]}
              onValueChange={(e) => setScaleIntervals(SCALES[e.value[0]].intervals)}
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
            <List.Root variant="plain" display="flex" flexDir="row" gap={1}>
              {Object.keys(availableIntervals).map((intervalKey) =>
                <List.Item key={intervalKey}>
                  <List.Root variant="plain" display="flex" flexDir="column" gap={1}>
                    {availableIntervals[intervalKey].map(interval => (
                      <List.Item key={`${intervalKey}-${interval.name}`}>
                        <ColorButton
                          color={INTERVAL_COLORS[interval.value - 1]}
                          isActive={getIntervalIndexInScale(interval) > -1}
                          onClick={() => toggleScaleInterval(interval)}
                        >
                          <span>{interval.name}</span>
                        </ColorButton>
                      </List.Item>))}
                  </List.Root>
                </List.Item>
              )}
            </List.Root>
          </GridItem>
          <GridItem colSpan={{ base: 4, md: 3}}>
            <Card.Root shadow="md">
              <Card.Body gap="2">
                <Card.Title mt="2">{scaleTitle}</Card.Title>
                <Card.Description>
                  <VStack alignItems="start">
                    <Text>This scale contains the following notes: <Em>{scale.notes.map(note => translateNote(note)).join(", ")}</Em></Text>
                    {scale.scaleChords.length > 0 && (
                      <>
                        <Text>I have extracted the following diatonic chords:</Text>
                        <List.Root variant="plain">
                          {scale.scaleChords.map(chord =>
                            chord.notation && (
                              <List.Item key={`${chord.root.name}${chord.notation}`}>
                                <Chord chord={chord} scale={scale} />
                              </List.Item>
                            )
                          )}
                        </List.Root>
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
                highlightFret={({ note }) => noteExistsInScale(scale, note)}
                getFret={(props) =>
                  <Fret
                    {...props}
                    scale={scale}
                  />
                }
              />
            </Box>
          </GridItem>
          <GridItem colSpan={4}>
            <Text>Here is the scale on a piano :</Text>
            <Box h="32">
              <PianoRoll scale={scale} PianoBlackKeyComponent={PianoBlackKey} PianoKeyComponent={PianoKey} />
            </Box>
          </GridItem>
        </Grid>
      </VStack>
    </Box>
  )
}

export default function SuspendedBuildScale() {
  return <Suspense><BuildScale /></Suspense>
}
