import React, { useState, useEffect } from 'react'
// eslint-disable-next-line no-unused-vars
import { Note } from 'mtts'
import classNames from 'classnames'

interface PianoNoteProps {
  notes: Note[];
  showNote?: boolean;
  isPreviousToBlackKey?: boolean;
  align?: 'top' | 'right' | 'bottom' | 'left';
  playing: boolean;
  startPlaying: (n: Note[]) => void;
  stopPlaying: (n: Note[]) => void;
}

const PianoNote = ({
  notes,
  showNote,
  isPreviousToBlackKey,
  align = 'left',
  playing,
  startPlaying,
  stopPlaying
}: PianoNoteProps) => {
  const [hasAccidental, setHasAccidental] = useState(false)
  const [noteText, setNoteText] = useState('')

  useEffect(() => {
    setHasAccidental(notes.reduce((previousValue, currentValue) => {
      return previousValue || currentValue.hasAccidental()
    }, false))

    if (notes.findIndex((n) => n.SPN === 'C4') > -1 || showNote === true) {
      setNoteText(notes.map(n => n.SPN).join(''))
    }
  }, [notes])

  const classes = classNames({
    'text-xs relative flex cursor-pointer': true,
    'bg-black text-white z-10': hasAccidental,
    'border bg-white': !hasAccidental
  }, {
    // left
    'rounded-r-sm justify-end items-center': align === 'left',
    'w-12 h-4': hasAccidental && align === 'left',
    'w-24 h-6': !hasAccidental && align === 'left',
    '-mb-2': (hasAccidental === true || isPreviousToBlackKey === true) && align === 'left'
  }, {
    // top
    'rounded-b-sm flex items-end items-end': align === 'top',
    'h-12 w-4': hasAccidental && align === 'top',
    'h-24 w-6': !hasAccidental && align === 'top',
    '-mr-2': (hasAccidental === true || isPreviousToBlackKey === true) && align === 'top'
  }, {
    // bottom
    'rounded-t-sm flex justify-center items-start self-end': align === 'bottom',
    'h-12 w-4': hasAccidental && align === 'bottom',
    'h-24 w-6': !hasAccidental && align === 'bottom',
    '-mr-2': (hasAccidental === true || isPreviousToBlackKey === true) && align === 'bottom'
  }, {
    // right
    'rounded-t-sm justify-start items-center self-end': align === 'right',
    'w-12 h-4': hasAccidental && align === 'right',
    'w-24 h-6': !hasAccidental && align === 'right',
    '-mb-2': (hasAccidental === true || isPreviousToBlackKey === true) && align === 'right'
  }, {
    // playingNote
    [`bg-mtts-${notes.map(n => n.name).join('-').toLowerCase()}`]: playing
  })

  function handleClick () {
    if (!playing) {
      startPlaying(notes)
    } else {
      stopPlaying(notes)
    }
  }

  return (
    <li className={ classes } onClick={handleClick}>
      <span className="p-1">{ noteText }</span>
    </li>
  )
}

export default PianoNote
