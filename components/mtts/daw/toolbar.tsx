import React from 'react'
import { useTypedSelector } from '../../../redux'
import { useDispatch } from 'react-redux'
import { incrementTempo, decrementTempo } from '../../../redux/tempo/actions'
import { useMetronome } from '../../../hooks/mtts/metronome'

const DawToolbar = () => {
  const bpm = useTypedSelector(state => state.tempo.bpm)
  const dispatch = useDispatch()
  const { isMetronomeReady, toggleMetronome } = useMetronome()

  function handleScrollCapture (event: React.WheelEvent<HTMLSpanElement>) {
    event.deltaY < 0 ? dispatch(incrementTempo(bpm)) : dispatch(decrementTempo(bpm))
  }

  return (
    <div>
      <button onClick={() => dispatch(incrementTempo(bpm))}>+</button>
      <span onWheel={ handleScrollCapture }>{ bpm }</span>
      <button onClick={() => dispatch(decrementTempo(bpm))}>-</button>
      <button onClick={() => isMetronomeReady ? toggleMetronome() : () => {}}>Metronome</button>
    </div>
  )
}

export default DawToolbar
