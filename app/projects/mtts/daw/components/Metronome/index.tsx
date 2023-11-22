import React, { useEffect, useState } from 'react'
import { useToneSynth } from '../../../hooks/tonejs'
import useMetronome from '../../../hooks/useMetronome/useMetronome'


export default function Metronome() {
  const [metronomeSide, setMetronomeSide] = useState<number>(0)
  const { synth } = useToneSynth()
  function bip(bipNumber: number) {
    synth.triggerAttackRelease("C4", "8n")
    setMetronomeSide((bipNumber) % 2)
  }
  const { bpm, updateBpm, toggleMetronome } = useMetronome(bip)

    
  return (
    <div className="flex flex-row">
      <p onClick={() => updateBpm(bpm - 1)}>-</p>
      <button onClick={() => toggleMetronome()}>{bpm}</button>
      <p onClick={() => updateBpm(bpm + 1)}>+</p>
    </div>
  )
}