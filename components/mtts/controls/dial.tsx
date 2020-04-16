// eslint-disable-next-line no-unused-vars
import React, { useMemo, useRef, useEffect } from 'react'
import { scale } from '../../../utils/misc'

interface DialProps {
  value: number
  onUpdate: (i: number) => void
  label?: string
  min?: number
  max?: number
}

const Dial = ({ value, onUpdate, min, max }: DialProps) => {
  const dial = useRef()
  const localMin = useMemo(() => {
    return min !== undefined ? min : 0
  }, [min])
  const localMax = useMemo(() => {
    return max !== undefined ? max : 100
  }, [max])

  // creating a ref to avoid event listener calling the wrong function
  const handlePointerLockMouseRef = useRef<(e: MouseEvent) => any>()
  const onUpdateRef = useRef<typeof onUpdate>(onUpdate)

  // update ref to cb update function when necessary
  useEffect(() => {
    onUpdateRef.current = onUpdate
  }, [onUpdate])

  // update the ref when the value changes
  useEffect(() => {
    handlePointerLockMouseRef.current = (e: MouseEvent) => {
      if (e.movementX > 0) {
        const incValue = (e.movementX > 3 ? 3 : e.movementX)
        // apply boudaries
        const newValue = (value + incValue) > localMax ? localMax : (value + incValue)
        onUpdateRef.current(newValue)
      } else if (e.movementX < 0) {
        const incValue = (e.movementX < 3 ? -3 : e.movementX)
        const newValue = value + incValue < localMin ? localMin : value + incValue
        onUpdateRef.current(newValue)
      }
    }
  }, [localMin, localMax, value])

  useEffect(() => {
    // create local value for the handler to allow event listener remove
    const localPointerHandler = (e) => handlePointerLockMouseRef.current(e)

    function handlePointerLockChange () {
      if (document.pointerLockElement === dial.current) {
        document.addEventListener('mousemove', localPointerHandler, false)
      } else {
        document.removeEventListener('mousemove', localPointerHandler, false)
      }
    }

    document.addEventListener('pointerlockchange', handlePointerLockChange, false)

    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange, false)
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

  return (
    <div>
      <div
        className="w-16 h-16 bg-mtts-dark-violet rounded-full relative cursor-dial"
        ref={dial}
        onPointerDown={addPointerLock}
        onPointerUp={removePointerLock}
      >
        <div className="w-12 h-12 bg-mtts-dark-violet-200 rounded-full absolute center-absolute">
          <div className="dial-indicator w-1 bg-mtts-light-violet h-1/2 absolute rounded center-absolute" style={{
            transform: `rotate(${deg}deg)`,
            transformOrigin: '50% 0%'
          }}></div>
        </div>
      </div>
    </div>
  )
}

export default Dial
