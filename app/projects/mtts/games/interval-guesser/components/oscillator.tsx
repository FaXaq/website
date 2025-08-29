import React, { useEffect, useState, useRef } from 'react'
// eslint-disable-next-line no-unused-vars
import * as Tone from 'tone'
import { scale } from '@/utils/misc'
import { theme } from '@/components/ui/theme'
import { setCanvasToParentDimension } from '@/utils/canvas'

const FREQUENCY_COLORS = [
  theme.colors['mtts-cta-2']
]

interface OscillatorProps {
  waveform: Tone.Waveform
}

const Oscillator = ({ waveform }: OscillatorProps) => {
  const canvas = useRef<HTMLCanvasElement>(undefined)
  const [animationFrame, setAnimationFrame] = useState<number>(-1)

  useEffect(() => {
    if (canvas.current) {
      setCanvasToParentDimension(canvas.current)
    }

    function showWaveform () {
      if (waveform && canvas.current) {
        const values: Float32Array = waveform.getValue()
        const context = canvas.current.getContext('2d')
        const width = context.canvas.width
        const height = context.canvas.height
        context.clearRect(0, 0, width, height)
        context.beginPath()
        context.lineWidth = 4
        values.forEach((v, i) => {
          const x = scale(i, 10, values.length, 0, width)
          const y = scale(v, -1, 1, 0, height)
          if (i === 0) {
            context.moveTo(x, y)
          } else {
            context.lineTo(x, y)
          }
          context.lineCap = 'round'
          context.strokeStyle = FREQUENCY_COLORS[0]
          context.stroke()
          context.save()
        })
        setAnimationFrame(requestAnimationFrame(showWaveform))
      }
    }

    showWaveform()

    return () => {
      if (animationFrame > -1) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [canvas, waveform])

  return (
    <div>
      <canvas ref={canvas}></canvas>
    </div>
  )
}

export default Oscillator
