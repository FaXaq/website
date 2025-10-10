'use client';

import { Note } from 'mtts';
import React, { useEffect, useMemo, useState } from 'react';

import type { InitInput, InitOutput } from "../../../../../wasm/auto-correlate/pkg";
import init, { auto_correlate } from "../../../../../wasm/auto-correlate/pkg";
import { useAnalyser } from '../hooks/useAnalyser';
import useMicInput from '../hooks/useMicInput';
import useWasmInit from '../hooks/useWasmInit';

enum DISPLAY {
  HZ = 'Hertz',
  NOTE = 'Note'
}

const LOW_DOMAIN = Note.fromSPN('C0');
const HIGH_DOMAIN = Note.fromSPN('C8');

const NOTES_IN_DOMAIN = Array.from(Array(Note.getSemitonesBetween(LOW_DOMAIN, HIGH_DOMAIN)).keys()).map((i) => {
  return Note.fromSPN(LOW_DOMAIN.SPN).sharpenChromatically(i);
});

function findClosestNote(searchedFrequency: number, notesInRange: Note[]): Note {
  if (notesInRange.length <= 3) {
    let noteFound = notesInRange[0];
    let closest = Math.abs(searchedFrequency - noteFound.frequency);
    for (let i = 1; i < notesInRange.length; i++) {
      const frequencyDifference = Math.abs(searchedFrequency - notesInRange[i].frequency);
      if (closest > frequencyDifference) {
        noteFound = notesInRange[i];
        closest = frequencyDifference;
      }
    }
    return noteFound;
  }

  const secondHalf = notesInRange.slice(notesInRange.length / 2, notesInRange.length);

  if (searchedFrequency < secondHalf[0].frequency) {
    return findClosestNote(searchedFrequency, notesInRange.slice(0, (notesInRange.length / 2) + 1));
  }

  return  findClosestNote(searchedFrequency, notesInRange.slice((notesInRange.length / 2) - 1, notesInRange.length));
}

export default function Tuner() {
  const [isGuessing, setIsGuessing] = useState<boolean>(false);
  const [display, setDisplay] = useState<DISPLAY>(DISPLAY.HZ);
  const [fq, setFq] = useState<number>(-1);
  const { isLoading, hasLoaded,  hasErrored, error } = useWasmInit<InitInput, InitOutput>(init);
  const { isActive, requestAccess, micStream, revokeAccess } = useMicInput();
  const { analyser } = useAnalyser(micStream, 2048);

  useEffect(() => {
    let interval = -1;
    if (isGuessing && isActive && analyser) {
      interval = setInterval(() => {
        const buffer = new Float32Array(analyser.fftSize);
        analyser.getFloatTimeDomainData(buffer);
        const fq = auto_correlate(buffer, analyser.context.sampleRate);
        if (fq > 0 && fq < 4500) {
          setFq(Math.round(fq * 100) / 100);
        }
      }, 200) as unknown as number;
    }

    return () => {
      clearInterval(interval);
    };
  }, [isActive, isGuessing, analyser]);

  const closestNote = useMemo(() => {
    return findClosestNote(fq, NOTES_IN_DOMAIN);
  }, [fq]);

  const frequencyDifference = useMemo(() => {
    return Math.round((fq - closestNote.frequency) * 100) / 100;
  }, [closestNote, fq]);

  function toggleTuner(activate: boolean) {
    if (activate) {
      setIsGuessing(true);
      if (!isActive) {
        requestAccess();
      }
    } else {
      setFq(-1);
      setIsGuessing(false);
      revokeAccess();
    }
  }

  return <div>
    <div>
      { isLoading && <p>loading...</p> }
      { hasErrored && <p>{JSON.stringify(error)}</p> }
      { !hasErrored && hasLoaded && (
        <div>
          <div>
            { display === DISPLAY.HZ && <p>{fq} Hz</p> }
            { display === DISPLAY.NOTE && (
              <div>
                <p>Note : {fq === -1 ? '-' : closestNote.SPN}</p>
                <p>{fq === -1 ? '-' : frequencyDifference}</p>
              </div>
            ) }
          </div>
        </div>
      )}
    </div>
    <div>
      <button onClick={() => toggleTuner(!isGuessing)}>
        {isGuessing ? 'stop' : 'start' }
      </button>
      <button onClick={() => setDisplay(display === DISPLAY.HZ ? DISPLAY.NOTE : DISPLAY.HZ )}>
        { display === DISPLAY.HZ ? 'Pitch' : 'Hz' }
      </button>
    </div>
  </div>;
}