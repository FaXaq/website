import { useEffect, useState } from 'react'
import * as Tone from 'tone'

function usePolysynth() {
  const [polysynth, setPolysynth] = useState<Tone.PolySynth | undefined>()

  useEffect(() => {
    setPolysynth(new Tone.PolySynth(2, Tone.Synth))

    return () => {
      if (polysynth) {
        polysynth.dispose()
      }
    }
  }, [])

  return polysynth
}

export { usePolysynth }
