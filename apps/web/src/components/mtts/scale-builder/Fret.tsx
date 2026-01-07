import { Box, Span, Text } from '@chakra-ui/react';
import type { Scale } from '@repo/mtts';
import type { Note } from '@repo/mtts';
import { useState } from 'react';

import { NOTE_DISPLAY, useScaleBuilderSettings } from './context/settings';
import { getNoteColor } from './helpers/getNoteColor';
import { getNoteInScale } from './helpers/getNoteInScale';
import { getNoteIntervalIndexInScale } from './helpers/getNoteIntervalIndexInScale';
import { noteExistsInScale } from './helpers/noteExistsInScale';
import { useNoteTranslation } from './hooks/useNoteTranslation';
import { getColorString } from './utils';

interface IFretProps {
  note: Note,
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
    <Box display="flex" alignItems="center" justifyContent="center" p={0.5} minH="8" h="full" w="full">
      {noteExistsInScale(scale, note)
        ? (<Box
          onClick={() => toggleFret()}
          borderColor={getColorString({ color: getNoteColor(scale, note) })}
          borderWidth="2px"
          w={highlighted ? '8' : '3'}
          h={highlighted ? '8' : '3'}
          rounded="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          bg={active ? getColorString({ color: getNoteColor(scale, note) }) : "bg.muted"}
          transition="all 0.1s ease-in-out"
        >
          {highlighted && <Span fontSize="xs">{getNoteText(scale, note)}</Span>}
        </Box>)
        : (<Text></Text>)}
    </Box>
  );
}

export default Fret;
