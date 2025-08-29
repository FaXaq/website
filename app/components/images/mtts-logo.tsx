'use client'

import { system } from '@chakra-ui/react/preset'
import React from 'react'

function MTTSLogo({ color = system.token("colors.fg") }: { color?: string }) {
  return (
    <svg viewBox="0 0 70 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="13"
        cy="13"
        r="13"
        transform="rotate(-90 13 13)"
        fill={color}
      />
      <circle
        cx="35"
        cy="13"
        r="13"
        transform="rotate(-90 35 13)"
        fill={color}
        fillOpacity="0.666"
      />
      <circle
        cx="57"
        cy="13"
        r="13"
        transform="rotate(-90 57 13)"
        fill={color}
        fillOpacity="0.333"
      />
    </svg>
  )
}

export default MTTSLogo
