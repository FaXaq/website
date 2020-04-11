import { useState, useEffect } from 'react'
import { useTypedSelector } from '../../redux'
import { MonoSynth } from 'tone'

export function useMetronome () {
  const bpm = useTypedSelector(state => state.tempo.bpm)
  const [monoSynth, setMonoSynth] = useState<MonoSynth | undefined>()

  useEffect(() => {
    setMonoSynth(new MonoSynth().toMaster())
  }, [])

  function toggleMetronome () {
    setInterval(() => {
      if (monoSynth !== undefined) {
        monoSynth.triggerAttackRelease(440, 0.005)
      } else {
        console.log('test')
      }
    }, (60 / bpm) * 1000)
  }

  return {
    toggleMetronome,
    isMetronomeReady: monoSynth !== undefined
  }
}
