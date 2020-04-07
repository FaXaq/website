import { useEffect, useState } from 'react'
import { PolySynth, Synth } from 'tone'
// eslint-disable-next-line no-unused-vars
import { Note } from 'mtts'
import { filterUniqueNotes } from '../../utils/mtts'

export function usePolySynth () {
  const [playingNotes, setPlayingNotes] =
    useState<{ [key: string]: boolean }>({})
  const [polysynth, setPolySynth] = useState<PolySynth | undefined>()

  useEffect(() => {
    setPolySynth(new PolySynth(6, Synth).toMaster())
  }, [])

  function startPlaying (notes: Note[]) {
    const uniqueNotes = filterUniqueNotes(notes)

    if (uniqueNotes.length < notes.length) {
      console.warn(
        'Reduced playing notes to only different frequencies.',
        'Unique notes (playing) :',
        uniqueNotes,
        'All notes : ',
        notes
      )
    }

    notes.map(n => {
      // if note is in unique notes array play it
      if (uniqueNotes.findIndex(un => un.SPN === n.SPN) > -1) {
        polysynth.triggerAttack(n.frequency)
      }
      setPlayingNotes(prevState =>
        ({ ...prevState, [n.SPN]: true })
      )
    })
  }

  function stopPlaying (notes: Note[]) {
    if (!polysynth) {
      console.warn('Synth not initialized')
      return
    }

    notes.map(n => {
      // if note is in playing notes stop it
      if (playingNotes[n.SPN] === true) {
        polysynth.triggerRelease(n.frequency)
      }
      setPlayingNotes(prevState =>
        ({ ...prevState, [n.SPN]: false })
      )
    })
  }

  function isPlaying (notes: Note[]) {
    return notes.reduce((previousValue, currentValue) => {
      return previousValue && playingNotes[currentValue.SPN]
    }, true)
  }

  return {
    startPlaying,
    stopPlaying,
    isPlaying
  }
}
