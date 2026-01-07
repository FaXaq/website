import { Box, Grid, Text } from "@chakra-ui/react";
import { useRef } from "react";

import { useGuitarNeck } from "./context";

const shouldShowFret = (fretIndex: number) => {
  if (fretIndex === 0) return false;
  const fretIndexModulo = fretIndex % 12;
  return fretIndexModulo === 0
    || fretIndexModulo === 3
    || fretIndexModulo === 5
    || fretIndexModulo === 7
    || fretIndexModulo === 9
    || fretIndexModulo === 12;
};

export const GuitarFretMarkerRow = () => {
  const { layout, fretNumber, containerRef } = useGuitarNeck();
  const fretMarkerRowRef = useRef<HTMLDivElement>(null);

  const fakeArray = Array.from({ length: fretNumber });

  return <Grid
    templateColumns={layout === "horizontal" ? `repeat(${fretNumber}, minmax(0, 1fr))` : undefined}
    templateRows={layout === "vertical" ? `repeat(${fretNumber}, minmax(0, 1fr))` : undefined}
    ref={fretMarkerRowRef}
  >
    {fakeArray.map((_f, i) => (
      <Box key={`fret-marker-${i}`} display="flex" flexDirection="column" alignItems="center">
        {shouldShowFret(i) && <Text>{i}</Text>}
        {shouldShowFret(i) && i === 12 && (
          <>
            <Box
              h="8px"
              w="8px"
              bg="gray.emphasized"
              borderRadius="full"
              position="absolute"
              top={`calc(${((containerRef?.current?.clientHeight ?? 0) - (fretMarkerRowRef?.current?.clientHeight ?? 0)) * 3 / 9}px)`}
              zIndex={1}
            />
            <Box
              h="8px"
              w="8px"
              bg="gray.emphasized"
              borderRadius="full"
              position="absolute"
              top={`calc(${((containerRef?.current?.clientHeight ?? 0) - (fretMarkerRowRef?.current?.clientHeight ?? 0)) * 6 / 9}px)`}
              zIndex={1}
            />
          </>
        )}
        {shouldShowFret(i) && i !== 12 && (
          <Box
            h="8px"
            w="8px"
            bg="gray.emphasized"
            borderRadius="full"
            position="absolute"
            top={`calc(${((containerRef?.current?.clientHeight ?? 0) - (fretMarkerRowRef?.current?.clientHeight ?? 0)) / 2}px - 4px)`}
            zIndex={1}
          />
        )}
      </Box>
    ))}
  </Grid>;
};
