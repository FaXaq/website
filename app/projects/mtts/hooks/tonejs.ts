import * as Tone from 'tone'
import { useState, useEffect } from 'react'

export function useVolume (decibels: number = -10) {
  const [volume, setVolume] = useState<Tone.Volume | undefined>()
  const [db, setDb] = useState<number>(decibels)

  useEffect(() => {
    setVolume(new Tone.Volume(db))

    return () => {
      if (volume) {
        volume.dispose()
      }
    }
  }, [])

  useEffect(() => {
    if (volume) {
      volume.volume.value = db
    } else {
      console.error("Cannot modify volume that doesn't exists")
    }
  }, [db])

  return [
    db,
    setDb,
    volume
  ]
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
