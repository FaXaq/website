import { Box, Grid, Text } from "@chakra-ui/react";
import { useRef } from "react";

import { useContainerDimensions } from "../hooks/useContainerDimensions";
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

const FRET_MARKER_PX_WIDTH = 12;

export const GuitarFretMarkerContainer = () => {
  const { layout, fretNumber, containerRef } = useGuitarNeck();
  const fretMarkerRowRef = useRef<HTMLDivElement>(null);
  const containerDimensions = useContainerDimensions(containerRef);
  const fretMarkerRowDimensions = useContainerDimensions(fretMarkerRowRef);

  const fakeArray = Array.from({ length: fretNumber });

  return <Grid
    templateColumns={layout === "horizontal" ? `repeat(${fretNumber}, minmax(0, 1fr))` : undefined}
    templateRows={layout === "vertical" ? `repeat(${fretNumber}, minmax(0, 1fr))` : undefined}
    ref={fretMarkerRowRef}
  >
    {fakeArray.map((_f, i) => (
      <Box key={`fret-marker-${i}`} display="flex" flexDirection={layout === "horizontal" ? "column" : "row"} alignItems="center">
        {shouldShowFret(i) && <Text w="full" fontSize="xs" textAlign={layout === "vertical" ? "right" : "center"} px={2}>{i}</Text>}
        {shouldShowFret(i) && i === 12 && (
          <>
            <Box
              h={`${FRET_MARKER_PX_WIDTH}px`}
              w={`${FRET_MARKER_PX_WIDTH}px`}
              bg="gray.emphasized"
              borderRadius="full"
              position="absolute"
              top={layout === "horizontal" ? `calc(${((containerDimensions.height ?? 0) - (fretMarkerRowDimensions.height ?? 0)) / 3}px)` : undefined}
              right={layout === "vertical" ? `calc(${((containerDimensions.width ?? 0) - (fretMarkerRowDimensions.width ?? 0)) / 3}px - ${FRET_MARKER_PX_WIDTH / 2}px)` : undefined}
              zIndex={1}
            />
            <Box
              h={`${FRET_MARKER_PX_WIDTH}px`}
              w={`${FRET_MARKER_PX_WIDTH}px`}
              bg="gray.emphasized"
              borderRadius="full"
              position="absolute"
              top={layout === "horizontal" ? `calc(${((containerDimensions.height ?? 0) - (fretMarkerRowDimensions.height ?? 0)) * 2 / 3}px)` : undefined}
              right={layout === "vertical" ? `calc(${((containerDimensions.width ?? 0) - (fretMarkerRowDimensions.width ?? 0)) * 2 / 3}px - ${FRET_MARKER_PX_WIDTH / 2}px)` : undefined}
              zIndex={1}
            />
          </>
        )}
        {shouldShowFret(i) && i !== 12 && (
          <Box
            h={`${FRET_MARKER_PX_WIDTH}px`}
            w={`${FRET_MARKER_PX_WIDTH}px`}
            bg="gray.emphasized"
            borderRadius="full"
            position="absolute"
            top={layout === "horizontal" ? `calc(${((containerDimensions.height ?? 0) - (fretMarkerRowDimensions.height ?? 0)) / 2}px - ${FRET_MARKER_PX_WIDTH / 2}px)` : undefined}
            right={layout === "vertical" ? `calc(${((containerDimensions.width ?? 0) - (fretMarkerRowDimensions.width ?? 0)) / 2}px - ${FRET_MARKER_PX_WIDTH / 2}px)` : undefined}
            zIndex={1}
          />
        )}
      </Box>
    ))}
  </Grid>;
};
