'use client';

import { useRef } from 'react';
import { useEffect,useState } from 'react';
import { FFT, Synth,Waveform } from 'tone';

export function useVolume(decibels = -10) {
  const [db, setDb] = useState<number>(decibels);

  return {
    db,
    setDb
  };
}

export function useFFT (fftNumber = 256) {
  const [fft, setFFT] = useState<FFT | undefined>();

  useEffect(() => {
    setFFT(new FFT(fftNumber));

    return () => {
      if (fft) {
        fft.dispose();
      }
    };
  }, []);

  return fft;
}

export function useWaveform (fftNumber = 256) {
  const [waveform, setWaveform] = useState<Waveform | undefined>();

  useEffect(() => {
    setWaveform(new Waveform(fftNumber));

    return () => {
      if (waveform) {
        waveform.dispose();
      }
    };
  }, []);

  return waveform;
}


export function useToneSynth() {
  const synthRef = useRef<Synth>(undefined);
  const synth = new Synth();

  useEffect(() => {
    synth.toDestination();
    synthRef.current = synth;

    return () => {
      synth.dispose();
      synthRef.current = undefined;
    };
  }, []);

  return {
    synth,
    synthRef
  };
}