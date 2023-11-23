'use client'

import React, { useRef } from 'react'
import * as Tone from 'tone'
import { useState, useEffect } from 'react'

export function useVolume(decibels: number = -10) {
  const [db, setDb] = useState<number>(decibels)

  return {
    db,
    setDb
  }
}

export function useFFT (fftNumber: number = 256) {
  const [fft, setFFT] = useState<Tone.FFT | undefined>()

  useEffect(() => {
    setFFT(new Tone.FFT(fftNumber))

    return () => {
      if (fft) {
        fft.dispose()
      }
    }
  }, [])

  return fft
}

export function useWaveform (fftNumber: number = 256) {
  const [waveform, setWaveform] = useState<Tone.Waveform | undefined>()

  useEffect(() => {
    setWaveform(new Tone.Waveform(fftNumber))

    return () => {
      if (waveform) {
        waveform.dispose()
      }
    }
  }, [])

  return waveform
}


export function useToneSynth() {
  const synthRef = useRef<Tone.Synth>()
  const synth = new Tone.Synth()

  useEffect(() => {
    synth.toDestination()
    synthRef.current = synth

    return () => {
      synth.dispose()
      synthRef.current = undefined
    }
  }, [])

  return {
    synth,
    synthRef
  }
}