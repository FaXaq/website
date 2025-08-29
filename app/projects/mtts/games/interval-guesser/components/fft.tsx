import React, { useEffect, useState, useRef } from 'react'
// eslint-disable-next-line no-unused-vars
import * as Tone from 'tone'
import { scale } from '@/utils/misc'
import { theme } from '@/components/ui/theme'
import { setCanvasToParentDimension } from '@/utils/canvas'

const FREQUENCY_COLORS = [
  theme.colors['mtts-cta-2']
]

interface FFTProps {
  fft: Tone.FFT
}

const FFT = ({ fft }: FFTProps) => {
  const canvas = useRef<HTMLCanvasElement>(undefined)
  const [animationFrame, setAnimationFrame] = useState<number>(-1)

  useEffect(() => {
    if (canvas.current) {
      setCanvasToParentDimension(canvas.current)
    }

    function showFFT () {
      if (fft && canvas.current) {
        const values: Float32Array = fft.getValue()
        const context = canvas.current.getContext('2d')
        const width = context.canvas.width
        const height = context.canvas.height
        const barWidth = Math.floor((context.canvas.width / values.length))
        context.clearRect(0, 0, width, height)
        context.fillStyle = FREQUENCY_COLORS[0]
        values.forEach((v, i) => {
          const x = scale(i, 0, values.length, 0, width)
          const barHeight = Math.ceil(scale(v, -100, 0, 0, height))
          context.fillRect(x, height / 2 - barHeight / 2, barWidth > 0 ? barWidth : 1, barHeight)
          context.fill()
        })
        setAnimationFrame(requestAnimationFrame(showFFT))
      }
    }

    showFFT()

    return () => {
      if (animationFrame > -1) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [canvas, fft])

  return (
    <div>
      <canvas ref={canvas} height="100" width="500"></canvas>
    </div>
  )
}

export default FFT
