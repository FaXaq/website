import { Box, NativeSelect, Stack, Text } from '@chakra-ui/react';
import type { ChangeEvent } from 'react';

import type { NotePosition } from './placements/utils';

export interface VoicingSelectorProps {
  voicings: NotePosition[][];
  selectedVoicing?: NotePosition[];
  onVoicingChange?: (voicing: NotePosition[]) => void;
}

export function VoicingSelector({
  voicings,
  selectedVoicing,
  onVoicingChange,
}: VoicingSelectorProps) {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const index = parseInt(event.target.value, 10);
    if (!isNaN(index) && voicings[index] && onVoicingChange) {
      onVoicingChange(voicings[index]);
    }
  };

  const getVoicingLabel = (voicing: NotePosition[], index: number) => {
    const frets = voicing.map(pos => pos.fretIndex);
    const minFret = Math.min(...frets);
    const maxFret = Math.max(...frets);
    const stringCount = voicing.length;
    return `Voicing ${index + 1} (${stringCount} strings, frets ${minFret}-${maxFret}) - ${voicing.map(pos => pos.note.SPN).join(', ')}`;
  };

  const selectedIndex = selectedVoicing
    ? voicings.findIndex(v => v === selectedVoicing)
    : -1;

  return (
    <Box
      as="aside"
      p={4}
      borderWidth="1px"
      borderRadius="md"
      width="300px"
    >
      <Stack gap={3}>
        <Text fontWeight="semibold" fontSize="lg">
          Chord Voicings
        </Text>

        {voicings.length > 0 ? (
          <>
            <Text fontSize="sm" color="gray.600">
              {voicings.length} voicing{voicings.length !== 1 ? 's' : ''} found
            </Text>

            <NativeSelect.Root size="sm">
              <NativeSelect.Field
                placeholder="Select a voicing"
                value={selectedIndex >= 0 ? selectedIndex.toString() : ''}
                onChange={handleChange}
              >
                {voicings.map((voicing, index) => (
                  <option key={index} value={index.toString()}>
                    {getVoicingLabel(voicing, index)}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </>
        ) : (
          <Text fontSize="sm" color="gray.500">
            No voicings available
          </Text>
        )}
      </Stack>
    </Box>
  );
}
