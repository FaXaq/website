
import { Badge, ColorSwatch } from '@chakra-ui/react';
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
    <Badge onClick={(e) => onClick(e)} p={1} bg={isActive ? swatchColor : "transparent"}>
      <ColorSwatch value={swatchColor} />
      {children}
    </Badge>
  );
}

export default ColorButton;
