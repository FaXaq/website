/* eslint-disable no-unused-vars */
'use client'

import React, { useMemo } from 'react'
import { COLOR } from '../helpers/getNoteColor'
import { Badge, ColorSwatch } from '@chakra-ui/react'
import { theme } from '@/components/ui/theme'
import { getColorString } from '../utils'

interface ColorButtonProps {
    color: COLOR,
    children: React.ReactNode,
    isActive: boolean,
    onClick: (...e: any) => any
}

function ColorButton({ children, isActive, onClick, color }: ColorButtonProps) {
  const swatchColor = getColorString({ color })

  
  return (
    <Badge onClick={(e) => onClick(e)} p={1} bg={isActive ? swatchColor : "transparent"}>
      <ColorSwatch value={swatchColor} />
      {children}
    </Badge>
  )
}

export default ColorButton
