import { useEffect, useState } from "react";

type WasmInitFunction = (e?: any) => Promise<any>;

export default function useWasmInit(init: WasmInitFunction) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hasLoaded, setHasLoaded] = useState<boolean>(false)
  const [hasErrored, setHasErrored] = useState<boolean>(false)
  const [error, setError] = useState<any>()

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true)
        await init()
        setIsLoading(false)
        setHasLoaded(true)
      } catch (err) {
        setHasErrored(true)
        setError(err)
        setHasLoaded(false)
      }
    })()
  }, [])

  return {
    isLoading,
    hasLoaded,
    hasErrored,
    error
  }
}