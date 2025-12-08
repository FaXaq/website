import { useEffect, useState } from 'react';
import * as Tone from 'tone';

function usePolysynth() {
  const [polysynth, setPolysynth] = useState<Tone.PolySynth | undefined>();

  function setVolume(db: number) {
    if (polysynth) {
      polysynth.volume.value = db;
    }
  }

  useEffect(() => {
    setPolysynth(new Tone.PolySynth().toDestination());

    return () => {
      if (polysynth) {
        polysynth.dispose();
      }
    };
  }, []);

  return {
    polysynth,
    setVolume
  };
}

export { usePolysynth };
