
import { Box, ColorSwatch } from '@chakra-ui/react';
import React from 'react';

import type { COLOR } from './helpers/getNoteColor';
import { getColorString } from './utils';

interface ColorButtonProps {
  color: COLOR,
  children: React.ReactNode,
  isActive: boolean,
  onClick: React.MouseEventHandler<HTMLSpanElement>
}

function ColorButton({ children, isActive, onClick, color }: ColorButtonProps) {
  const swatchColor = getColorString({ color });


  return (
    <Box
      role="button"
      onClick={(e) => onClick(e)}
      p={1}
      borderColor={isActive ? swatchColor : "transparent"}
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderWidth="1px"
      rounded="md"
      gap={2}
      cursor="pointer"
    >
      <ColorSwatch value={swatchColor} />
      {children}
    </Box>
  );
}

export default ColorButton;
