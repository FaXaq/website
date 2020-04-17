// eslint-disable-next-line no-unused-vars
import React, { useMemo, useRef, useEffect, useCallback, useState } from 'react'
import { scale } from '../../../utils/misc'
import { useDefaultProp } from '../../../hooks/misc'

interface KnobProps {
  value: number
  onUpdate: (i: number) => void
  label?: string
  min?: number
  max?: number
  step?: number
}

const getPointFromTouch = (touch: React.Touch, element: Element) => {
  const rect = element.getBoundingClientRect()
  return {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top
  }
}

const Knob = ({ value, onUpdate, min, max, label, step }: KnobProps) => {
  const knob = useRef()
  const localMin = useDefaultProp(min, 0)
  const localMax = useDefaultProp(max, 100)
  const localStep = useDefaultProp(step, 1)

  // creating a ref to avoid event listener calling the wrong function
  const handlePointerLockMouseRef = useRef<(e: MouseEvent) => any>()
  const handleTouchMoveRef = useRef<(e: React.TouchEvent<Element>) => any>()
  const onUpdateRef = useRef<typeof onUpdate>(onUpdate)

  // update ref to cb update function when necessary
  useEffect(() => {
    onUpdateRef.current = onUpdate
  }, [onUpdate])

  const updateValue = useCallback((diff: number) => {
    if (diff > 0) {
      const incValue = (diff > localStep ? localStep : diff)
      // apply boudaries
      const newValue = (value + incValue) > localMax ? localMax : (value + incValue)
      onUpdateRef.current(newValue)
    } else if (diff < 0) {
      const incValue = (diff < -localStep ? -localStep : diff)
      const newValue = value + incValue < localMin ? localMin : value + incValue
      onUpdateRef.current(newValue)
    }
  }, [localMin, localMax, localStep, value])

  // update the ref when the value changes
  useEffect(() => {
    handlePointerLockMouseRef.current = (e: MouseEvent) => {
      updateValue(e.movementX)
    }
  }, [updateValue])

  const [prevX, setPrevX] = useState(0)

  useEffect(() => {
    handleTouchMoveRef.current = (e: React.TouchEvent<HTMLDivElement>) => {
      // handle only one finger pan
      if (e.touches.length === 1 && !(document.pointerLockElement === knob.current)) {
        e.preventDefault()
        const { x } = getPointFromTouch(e.touches[0], knob.current)
        setPrevX(x)
        updateValue(x - prevX)
      }
    }
  }, [prevX, updateValue])

  useEffect(() => {
    // create local value for the handler to allow event listener remove
    const localPointerHandler = (e) => handlePointerLockMouseRef.current(e)

    function handlePointerLockChange () {
      if (document.pointerLockElement === knob.current) {
        document.addEventListener('mousemove', localPointerHandler, false)
      } else {
        document.removeEventListener('mousemove', localPointerHandler, false)
      }
    }

    document.addEventListener('pointerlockchange', handlePointerLockChange, false)

    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange, false)
      document.removeEventListener('mousemove', localPointerHandler, false)
    }
  }, [])

  function addPointerLock (e: React.PointerEvent<HTMLDivElement>) {
    const div: HTMLDivElement = e.currentTarget as HTMLDivElement
    div.requestPointerLock = div.requestPointerLock || (div as any).requestPointerLock
    div.requestPointerLock()
  }

  function removePointerLock () {
    document.exitPointerLock = document.exitPointerLock || (document as any).mozExitPointerLock
    document.exitPointerLock()
  }

  const deg = useMemo(() => {
    return scale(value, localMin, localMax, 20, 340)
  }, [localMax, localMin, value])

  const toggleValue = useCallback(() => {
    if (value !== localMin) {
      onUpdateRef.current(localMin)
    }
  }, [value])

  return (
    <div className="p-1">
      {
        label
          ? <p className="text-center mb-1">{label}</p>
          : <></>
      }
      <div
        className="w-16 h-16 bg-mtts-dark-violet rounded-full relative cursor-dial mx-auto"
        ref={knob}
        onPointerDown={addPointerLock}
        onPointerUp={removePointerLock}
        onDoubleClick={toggleValue}
        onTouchMove={handleTouchMoveRef.current}
      >
        <div className="w-12 h-12 bg-mtts-dark-violet-200 rounded-full absolute center-absolute">
          <div className="dial-indicator w-1 bg-mtts-light-violet h-1/2 absolute rounded center-absolute" style={{
            transform: `rotate(${deg}deg)`,
            transformOrigin: '50% 0%'
          }}></div>
        </div>
      </div>
      <ul></ul>
    </div>
  )
}

export default Knob
