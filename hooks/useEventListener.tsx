import { useRef, useEffect } from 'react'

const useEventListener = (eventName: string, element: Window | Document | Element = window, handler: EventListener) => {
  const storedHandler = useRef(handler)

  useEffect(() => {
    storedHandler.current = handler
  }, [handler])

  useEffect(() => {
    const eventListener = event => storedHandler.current(event)
    element.addEventListener(eventName, eventListener)
    return () => {
      element.removeEventListener(eventName, eventListener)
    }
  }, [eventName, element])
}

export default useEventListener
