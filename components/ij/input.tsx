import React, { Suspense } from 'react'

interface IProps {
  i: number;
  j: number;
  getValue: (i: number, j: number) => Promise<string>;
  setValue: (i: number, j: number, value: string) => Promise<boolean>;
}

function suspender<T> (promise: Promise<T>): { read: () => T } {
  let status = 'pending'
  let result
  const suspender = promise.then(
    r => {
      status = 'success'
      result = r
    },
    e => {
      status = 'error'
      result = e
    }
  )
  return {
    read () {
      if (status === 'pending') {
        throw suspender
      } else if (status === 'error') {
        throw result
      } else if (status === 'success') {
        return result
      }
    }
  }
}

function IJInput ({ i, j, getValue }: IProps) {
  const value = suspender(getValue(i, j)).read()
  return <input value={value} />
}

function IJInputWrapped (props: IProps) {
  return <Suspense fallback={<p>loading</p>}>
    <IJInput {...props} />
  </Suspense>
}

export default IJInputWrapped
