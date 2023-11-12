import React from 'react'
import { PianoKeyComponentProps } from "../../components/keys/PianoKey"
import classNames from 'classnames'
import { COLOR, getNoteColor } from '../helpers/getNoteColor'

export default function PianoKey({ scale, note }: PianoKeyComponentProps) {
  console.log(scale, note)
  return <div className={classNames({
    'h-full w-full': true,
    'bg-mtts-cta-0': getNoteColor(scale, note) === COLOR.DEFAULT,
    'bg-mtts-yellow': getNoteColor(scale, note) === COLOR.YELLOW,
    'bg-mtts-khaki': getNoteColor(scale, note) === COLOR.KHAKI,
    'bg-mtts-green': getNoteColor(scale, note) === COLOR.GREEN,
    'bg-mtts-blue': getNoteColor(scale, note) === COLOR.BLUE,
    'bg-mtts-violet': getNoteColor(scale, note) === COLOR.VIOLET,
    'bg-mtts-red': getNoteColor(scale, note) === COLOR.RED,
  })}></div>
}