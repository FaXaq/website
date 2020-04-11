import React, { useState, useEffect } from 'react'
// eslint-disable-next-line no-unused-vars
import { Note } from 'mtts'
import classNames from 'classnames'

interface PianoKeyProps {
  notes: Note[];
  showNote?: boolean;
  align?: 'top' | 'right' | 'bottom' | 'left';
  playing: boolean;
  hasAccidental?: boolean
}

const PianoKey = ({
  notes,
  showNote,
  align = 'left',
  playing,
  hasAccidental
}: PianoKeyProps) => {
  const [noteText, setNoteText] = useState('')

  useEffect(() => {
    if (notes.findIndex((n) => n.SPN === 'C4') > -1 || showNote === true) {
      setNoteText(notes.map(n => n.SPN).join(''))
    }
  }, [notes])

  const classes = classNames({
    'text-xs relative flex cursor-pointer': true,
    'bg-black text-white z-10': hasAccidental,
    'bg-white': !hasAccidental
  }, {
    // left
    'rounded-r-sm justify-end items-center border-t border-r border-b': align === 'left',
    'w-12 h-4': hasAccidental && align === 'left',
    'w-24 h-6': !hasAccidental && align === 'left'
  }, {
    // top
    'rounded-b-sm flex items-end items-end border-l border-r border-b': align === 'top',
    'h-12 w-4': hasAccidental && align === 'top',
    'h-24 w-6': !hasAccidental && align === 'top'
  }, {
    // bottom
    'rounded-t-sm flex justify-center items-start self-end border-t border-r border-l': align === 'bottom',
    'h-12 w-4': hasAccidental && align === 'bottom',
    'h-24 w-6': !hasAccidental && align === 'bottom'
  }, {
    // right
    'rounded-l-sm justify-start items-center self-end border-t border-l border-b': align === 'right',
    'w-12 h-4': hasAccidental && align === 'right',
    'w-24 h-6': !hasAccidental && align === 'right'
  }, {
    // playingNote
    [`bg-mtts-${notes.map(n => n.name).join('-').toLowerCase()}`]: playing
  })

  return (
    <div className={ classes }>
      <span className="p-1">{ noteText }</span>
    </div>
  )
}

export default React.memo(PianoKey)
