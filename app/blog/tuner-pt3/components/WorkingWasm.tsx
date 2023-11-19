'use client'

import init, { greet } from '../../../../wasm/auto-correlate/pkg/auto_correlate'
import React, { useEffect, useState } from 'react'

export default function WorkingWasm() {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    (async () => {
      await init()
      setGreeting(greet('Marin'))
    })()
  }, [])

  return <p>{greeting}</p>
}