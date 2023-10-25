import React, { useRef, useEffect, useState, useCallback } from 'react'
import { theme } from '../../../../../../tailwind.config'

const CANVAS_HEIGHT = 150
const AMPLITUDE = (CANVAS_HEIGHT / 2) - 10
// Add default offset for X to prevent canvas sine being cut too sharp
const X_DEFAULT_OFFSET = 4
const FREQUENCY_COLORS = [
  theme.extend.colors['mtts-cta-2'],
  theme.extend.colors['mtts-cta-4']
]

interface IntervalGuesserOscillatorProps {
  frequencies: number[];
  highAmplitude: boolean;
  onClick: (...e: any) => any;
  animated: boolean;
}

interface DrawSineParameters {
  amplitude?: number,
  frequency: number,
  frequencyIndex: number,
  offset?: number,
  animated?: boolean,
  clear?: boolean
}

function drawAxes (ctx: CanvasRenderingContext2D) {
  const width = ctx.canvas.width
  const height = ctx.canvas.height
  const xMin = 0

  ctx.beginPath()
  ctx.strokeStyle = 'rgb(128,128,128)'

  // X-Axis
  ctx.moveTo(xMin, height / 2)
  ctx.lineTo(width, height / 2)

  // Y-Axis
  ctx.moveTo(width / 2, 0)
  ctx.lineTo(width / 2, height)

  // Starting line
  ctx.moveTo(0, 0)
  ctx.lineTo(0, height)

  ctx.stroke()
}

function setCanvasWidth (ctx: CanvasRenderingContext2D) {
  ctx.canvas.width = window.innerWidth
}

const IntervalGuesserOscillator = ({ frequencies, highAmplitude, onClick, animated }: IntervalGuesserOscillatorProps) => {
  const [showAxes] = useState(false)
  const canvas = useRef<HTMLCanvasElement>()
  const [animationFrames, setAnimationFrames] = useState<number[]>([])

  const drawSine = (ctx: CanvasRenderingContext2D, {
    amplitude = AMPLITUDE,
    frequency,
    frequencyIndex,
    offset = 0,
    clear = false
  }: DrawSineParameters) => {
    if (clear) {
    // clear rectangle from previous drawing
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    }

    const width = ctx.canvas.width - X_DEFAULT_OFFSET
    const height = ctx.canvas.height

    let x = X_DEFAULT_OFFSET
    let y = 0

    ctx.beginPath()
    ctx.lineCap = 'round'
    ctx.lineWidth = 5
    ctx.strokeStyle = FREQUENCY_COLORS[frequencyIndex]

    while (x < width) {
      y = height / 2 + amplitude * Math.sin((x + offset) / (frequency / 20))
      ctx.lineTo(x, y)
      x++
    }

    ctx.stroke()
    ctx.save()

    if (animated) {
      setAnimationFrames(prev => {
        prev[frequencyIndex] = requestAnimationFrame(() => {
          drawSine(ctx, {
            amplitude,
            frequency,
            frequencyIndex,
            offset: offset + 4,
            clear
          })
        })
        return prev
      })
    }

    return -1
  }

  const cancelAnimationFrames = useCallback(() => {
    animationFrames.map(frame => {
      if (frame !== -1) {
        cancelAnimationFrame(frame)
      }
    })
  }, [animationFrames])

  useEffect(() => {
    cancelAnimationFrames()
    if (canvas.current !== undefined) {
      const ctx = canvas.current.getContext('2d')
      setCanvasWidth(ctx)
      if (showAxes) {
        drawAxes(ctx)
      }

      frequencies.map((f, i) => drawSine(ctx, {
        amplitude: highAmplitude ? AMPLITUDE : AMPLITUDE / 10,
        frequency: f,
        frequencyIndex: i,
        clear: i % 2 === 0
      }))
    }

    return () => {
      cancelAnimationFrames()
    }
  }, [highAmplitude, frequencies])

  return (
    <div className="flex justify-center py-8">
      <canvas
        onClick={() => onClick()}
        ref={canvas}
        width="100%"
        height={ CANVAS_HEIGHT }
      ></canvas>
    </div>
  )
}

export default React.memo(IntervalGuesserOscillator)
