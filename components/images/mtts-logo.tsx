import React from 'react'
import Anime from 'react-anime'

function MTTSLogo () {
  return (
    <svg viewBox="0 0 70 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Anime
        opacity={[0, 1]}
        duration={5000}
        delay={(_, i) => i * 300}
        svg={true}
      >
        <circle
          cx="13"
          cy="13"
          r="13"
          transform="rotate(-90 13 13)"
          fill="white"
        />
        <circle
          cx="35"
          cy="13"
          r="13"
          transform="rotate(-90 35 13)"
          fill="white"
          fillOpacity="0.666"
        />
        <circle
          cx="57"
          cy="13"
          r="13"
          transform="rotate(-90 57 13)"
          fill="white"
          fillOpacity="0.333"
        />
      </Anime>
    </svg>
  )
}

export default MTTSLogo
