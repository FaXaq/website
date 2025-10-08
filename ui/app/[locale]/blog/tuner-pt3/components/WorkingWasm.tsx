'use client';

import React, { useEffect, useState } from 'react';

import init, { greet } from '../../../../wasm/auto-correlate/pkg/auto_correlate';

export default function WorkingWasm() {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    (async () => {
      await init();
      setGreeting(greet('Marin'));
    })();
  }, []);

  return <p>{greeting}</p>;
}