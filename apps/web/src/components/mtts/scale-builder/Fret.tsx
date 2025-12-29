import { Badge, Box, Text } from '@chakra-ui/react';
import type { Scale } from '@repo/mtts';
import { Note } from '@repo/mtts';
import { useState } from 'react';

import { NOTE_DISPLAY, useScaleBuilderSettings } from './context/settings';
import { getNoteColor } from './helpers/getNoteColor';
import { getNoteInScale } from './helpers/getNoteInScale';
import { getNoteIntervalIndexInScale } from './helpers/getNoteIntervalIndexInScale';
import { noteExistsInScale } from './helpers/noteExistsInScale';
import { useNoteTranslation } from './hooks/useNoteTranslation';
import { getColorString } from './utils';

interface IFretProps {
  note: Note | string,
  stringNumber: number,
  fretNumber: number,
  highlighted: boolean,
  scale: Scale
}

function Fret({ note, highlighted, scale, fretNumber }: IFretProps) {
  const [active, setActive] = useState(false);
  const { translateNote } = useNoteTranslation();
  const { noteDisplay } = useScaleBuilderSettings();

  function toggleFret() {
    setActive(!active);
  }

  if (!(note instanceof Note)) {
    return <div>
      <p>
        {(fretNumber === 12 || fretNumber === 24) && '••'}
        {(fretNumber === 3 || fretNumber === 5 || fretNumber === 7 || fretNumber === 9) && '•'}
        {(fretNumber === 15 || fretNumber === 17 || fretNumber === 19 || fretNumber === 21) && '•'}
      </p>
    </div>;
  }

  function getNoteText(scale: Scale, note: Note): string {
    if (!noteExistsInScale(scale, note)) {
      return '';
    }

    let str = '';

    if (noteDisplay === NOTE_DISPLAY.NOTE_NAME || noteDisplay === NOTE_DISPLAY.BOTH) {
      str += translateNote(getNoteInScale(scale, note));
    }

    if (noteDisplay === NOTE_DISPLAY.NOTE_NAME) {
      return str;
    } else if (noteDisplay === NOTE_DISPLAY.BOTH) {
      str += ' / ';
    }

    if (noteDisplay === NOTE_DISPLAY.SCALE_DEGREE || noteDisplay === NOTE_DISPLAY.BOTH) {
      const index = getNoteIntervalIndexInScale(scale, note);
      if (index < 0) {
        return '';
      }
      str += scale.intervals[index]?.name ?? '';
    }

    return str;
  }

  return (
    <Box onClick={() => toggleFret()} bg={active ? "purple.muted" : "transparent"} w="full" h="full" p={1}>
      {noteExistsInScale(scale, note)
        ? (<Badge display="inline-block" bg={getColorString({ color: getNoteColor(scale, note) })}>{getNoteText(scale, note)}</Badge>)
        : (<Text></Text>) }
    </Box>
  );
}

export default Fret;
