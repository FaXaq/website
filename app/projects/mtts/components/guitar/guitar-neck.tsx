'use client'

import React, { useEffect, useMemo } from 'react'
// eslint-disable-next-line no-unused-vars
import { Note, Pitch } from 'mtts'
// eslint-disable-next-line no-unused-vars
import GuitarString, { GuitarStringProps } from './_guitar-string'
import { FGetFret, FHighlight } from './_guitar-fret'
import { FRET_MARKER } from './const'
import classNames from 'classnames'
import { GuitarNeckLayout, GuitarNeckProvider, useGuitarNeck } from './context'

const DEFAULT_GUITAR_TUNING = (() => [
  FRET_MARKER,
  new Note({ name: 'E', pitch: new Pitch({ value: 4 }) }).SPN,
  new Note({ name: 'B', pitch: new Pitch({ value: 3 }) }).SPN,
  new Note({ name: 'G', pitch: new Pitch({ value: 3 }) }).SPN,
  new Note({ name: 'D', pitch: new Pitch({ value: 3 }) }).SPN,
  new Note({ name: 'A', pitch: new Pitch({ value: 2 }) }).SPN,
  new Note({ name: 'E', pitch: new Pitch({ value: 2 }) }).SPN
])()
const DEFAULT_FRET_NUMBERS = 24

export interface GuitarNeckProps {
  tuning?: string[],
  fretNumber?: number,
  highlightFret?: FHighlight,
  getFret?: FGetFret,
  layout?: GuitarNeckLayout
}

function GuitarNeck ({
  highlightFret = () => false,
  getFret = ({ note }) => note instanceof Note ? note.SPN : FRET_MARKER,
  tuning = DEFAULT_GUITAR_TUNING,
  fretNumber = DEFAULT_FRET_NUMBERS,
  layout = 'horizontal'
}: GuitarNeckProps) {
  const strings: GuitarStringProps[] = tuning.map((t, i) => ({
    tuning: t,
    highlightFret,
    getFret,
    fretNumber,
    stringNumber: i,
  }))

  const { layout: contextLayout } = useGuitarNeck()

  return <div>
    <ul className={classNames({
      'flex flex-col': contextLayout === 'horizontal',
      'flex flex-row': contextLayout === 'vertical'
    })}>
      { strings.map((string) => <GuitarString key={`string-${string.stringNumber}`} {...string} />)}
    </ul>
  </div>
}

export default function GuitarNeckWithProvider(props: GuitarNeckProps) {
  return (
    <GuitarNeckProvider value={{ layout: props.layout }}>
      <GuitarNeck {...props} />
    </GuitarNeckProvider>
  )
}
