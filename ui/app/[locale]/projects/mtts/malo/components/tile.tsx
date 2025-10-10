'use client';


import type { Note } from 'mtts';
import { useTranslation } from 'next-i18next';
import React from 'react';

interface TileProps {
    notes: Note[];
    playing: boolean
}

const Tile = ({ notes, playing }: TileProps) => {
  const { t } = useTranslation();

  const formatNoteString = (note: Note) => {
    return '' + t(`mtts.notes.${note.name}`) +
        (note.hasAccidental() && note.accidental.semitones !== 0
          ? t(`mtts.accidentals.${note.accidental.name}`)
          : '' + note.pitch.value);
  };


  const notesItems = notes.map(n => {
    return <li

      key={`tile-note-${n.name}-${n.pitch.value}`}>
      <span >
        {formatNoteString(n)}
      </span>
    </li>;
  });

  const joinedNames = notes.map(n => n.name).join('-').toLowerCase();

  return (
    <div >
      <ul>
        {notesItems}
      </ul>
    </div>
  );
};

export default React.memo(Tile);
