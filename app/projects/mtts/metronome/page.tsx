'use client'

import classNames from 'classnames'
import React, { useRef, useState } from 'react'
import { useToneSynth } from '../hooks/tonejs'
import useMetronome from '../hooks/useMetronome/useMetronome'


export default function Metronome() {
  const [previousTap, setPreviousTap] = useState<number>(0)
  const [metronomeBeat, setMetronomeBeat] = useState<number>(0)
  const [editing, setEditing] = useState<boolean>(false)
  const input = useRef<HTMLInputElement>()
  const { synth } = useToneSynth()

  function onBip(beatNumber: number) {
    if (beatNumber % 2 === 0) {
      synth.triggerAttackRelease("A4", "16n")
    } else {
      synth.triggerAttackRelease("C4", "16n")
    }
    setMetronomeBeat((beatNumber) % 2)
  }

  const { bpm, updateBpm, toggleMetronome, isActive } = useMetronome(onBip)

  function startEditing() {
    setEditing(true)
    setTimeout(() => {
      input.current.focus()
      input.current.select()
    }, 25)
  }

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
        <div className={classNames({
          "grow": true,
          "bg-mtts-dark-violet": metronomeBeat === 0
        })}></div>
        <div className={classNames({
          "grow": true,
          "bg-mtts-dark-violet-200": metronomeBeat === 1
        })}></div>
      </div>
      <div className="text-center flex flex-row justify-center items-center bg-mtts-light-violet text-white">
        <button onClick={() => toggleMetronome()}>
          {isActive ? 'stop' : 'start'}
        </button>
        <div className="p-4 w-24">
          {!editing && <p onDoubleClick={() => startEditing()}>{bpm}</p> }
          {editing && <input className="text-center block w-full h-full" ref={input} type="number" onBlur={() => setEditing(false)} value={bpm} onChange={(e) => updateBpm(parseInt(e.target.value))} />}
        </div>
        <button onClick={() => triggerTap()}>
          Tap
        </button>
      </div>
    </div>
  )
}