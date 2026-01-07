import { Box, Grid, Text } from "@chakra-ui/react";
import type { FC } from "react";

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

const SimpleFretMarker: FC = () => {
  const { containerRef } = useGuitarNeck();
  return <Box
    h="8px"
    w="8px"
    bg="gray.emphasized"
    borderRadius="full"
    position="absolute"
    top={`calc(8px - ${(containerRef?.current?.clientHeight ?? 0) / 2}px)`}
    left="calc(50% - 4px)"
    zIndex={1}
  />;
};

const SpecialFretMarker: FC = () => {
  const { containerRef } = useGuitarNeck();
  return <>
    <Box
      h="8px"
      w="8px"
      bg="gray.emphasized"
      borderRadius="full"
      position="absolute"
      top={`calc(8px - ${(containerRef?.current?.clientHeight ?? 0) * 3.25 / 5}px)`}
      left="calc(50% - 4px)"
      zIndex={1}
    />
    <Box
      h="8px"
      w="8px"
      bg="gray.emphasized"
      borderRadius="full"
      position="absolute"
      top={`calc(8px - ${(containerRef?.current?.clientHeight ?? 0) * 1.75 / 5}px)`}
      left="calc(50% - 8px)"
      zIndex={1}
    />
  </>;
};

export const GuitarFretMarker = () => {
  const { layout, fretNumber } = useGuitarNeck();

  const frets = Array.from({ length: fretNumber }, (_, i) => ({
    number: i,
    show: shouldShowFret(i),
    indicator: <Text textAlign="center">{i}</Text>,
    dot: (() => {
      if (!shouldShowFret(i)) return null;
      if (i === 12) return <SpecialFretMarker />;
      return <SimpleFretMarker />;
    })()
  }));

  return <Grid
    templateColumns={layout === "horizontal" ? `repeat(${fretNumber}, minmax(0, 1fr))` : undefined}
    templateRows={layout === "vertical" ? `repeat(${fretNumber}, minmax(0, 1fr))` : undefined}
  >
    {frets.map((fret, i) => (
      <Box key={i} position="relative">
        {fret.show && fret.indicator}
        {fret.dot}
      </Box>
    ))}
  </Grid>;
};
