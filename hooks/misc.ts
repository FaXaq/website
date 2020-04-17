import { useMemo } from 'react'

export function useDefaultProp<T> (prop: T, defaultValue: T) {
  const localProp = useMemo(() => {
    return prop === undefined ? defaultValue : prop
  }, [prop])

  return localProp
}
