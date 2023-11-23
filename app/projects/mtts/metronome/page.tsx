'use client'

import classNames from 'classnames'
import dynamic from 'next/dynamic'
import React, { useCallback, useRef, useState } from 'react'
import { useToneSynth } from '../hooks/tonejs'
import useMetronome from '../hooks/useMetronome/useMetronome'
import EditableText from './components/editableText'

function Metronome() {
  const [previousTap, setPreviousTap] = useState<number>(0)
  const [beatNumber, setBeatNumber] = useState<number>(4)
  const [metronomeBeat, setMetronomeBeat] = useState<number>(0)
  const { synthRef } = useToneSynth()

  const onBip = useCallback((metronomeBeat: number) => {
    if (synthRef) {
      if (metronomeBeat % beatNumber === 0) {
        synthRef.current.triggerAttackRelease("A4", "16n")
      } else {
        synthRef.current.triggerAttackRelease("C4", "16n")
      }
    }
    setMetronomeBeat((metronomeBeat) % beatNumber)
  }, [synthRef, beatNumber])

  const { bpm, updateBpm, toggleMetronome, isActive } = useMetronome(onBip)

  function triggerTap() {
    const now = Date.now()
    const diff = now - previousTap
    if (previousTap === 0) {
      setPreviousTap(now)
    } else {
      if (diff < 2000 && diff > 200) {
        updateBpm(Math.round((60 / diff) * 1000))
      }
      setPreviousTap(0)
    }
  }
    
  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="grow flex flex-col md:flex-row">
        {
          Array.from(new Array(beatNumber).keys()).map((v, i) => (
            <div key={`beat-${i}`} className={classNames({
              "grow border": true,
              "border-mtts-dark-violet": i === 0,
              "border-mtts-light-violet": i !== 0,
              "bg-mtts-dark-violet": metronomeBeat === 0 && i === 0,
              "bg-mtts-light-violet": metronomeBeat === i && i !== 0
            })}></div>
          ))
        }
      </div>
      <div className="text-center flex flex-row justify-center items-center bg-mtts-light-violet text-white">
        <button onClick={() => toggleMetronome()}>
          {isActive ? 'stop' : 'start'}
        </button>
        <div className="p-4 w-24">
          <EditableText value={bpm.toString()} updateValue={(e) => updateBpm(Number.isNaN(parseInt(e)) ? 0 : parseInt(e))} />
        </div>
        <button onClick={() => triggerTap()}>
          Tap
        </button>
        <div className="p-4 w-24">
          <EditableText value={beatNumber.toString()} updateValue={(e) => setBeatNumber(Number.isNaN(parseInt(e)) ? 0 : parseInt(e))} />
        </div>
      </div>
    </div>
  )
}

export default dynamic(
  () => Promise.resolve(Metronome), 
  {
    ssr: false
  }
)