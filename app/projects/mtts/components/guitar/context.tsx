import React, { Reducer, createContext, useContext, useReducer } from 'react'

export type GuitarNeckLayout = 'vertical' | 'horizontal'

interface GuitarNeckContextState {
  layout: GuitarNeckLayout,
  setGuitarNeckLayout: (layout: GuitarNeckLayout) => void,
}

const INITIAL_STATE: GuitarNeckContextState = {
  layout: 'horizontal',
  setGuitarNeckLayout: () => {}
}

enum ACTION_TYPE {
    SET_LAYOUT = 'SET_LAYOUT'
}

const GuitarNeckContext = createContext(INITIAL_STATE)

const GuitarNeckReducer: Reducer<GuitarNeckContextState, { type: ACTION_TYPE, payload: GuitarNeckLayout }> = (state, action) => {
  const { type, payload } = action

  switch (type) {
  case ACTION_TYPE.SET_LAYOUT:
    return {
      ...state,
      layout: payload
    }
  default:
  }

  return { ...state }
}

interface ProviderProps {
  children: React.ReactNode,
  value: Partial<GuitarNeckContextState>
}

export function GuitarNeckProvider({ children, value }: ProviderProps) {
  const [state, dispatch] = useReducer(GuitarNeckReducer, Object.assign(INITIAL_STATE, value))

  const setGuitarNeckLayout = (layout: GuitarNeckLayout) => {
    dispatch({ type: ACTION_TYPE.SET_LAYOUT, payload: layout })
  }

  const initialValue: GuitarNeckContextState = {
    layout: state.layout,
    setGuitarNeckLayout
  }

  return (
    <GuitarNeckContext.Provider value={initialValue}>
      {children}
    </GuitarNeckContext.Provider>
  )
}

export const useGuitarNeck = () => {
  const context = useContext(GuitarNeckContext)

  if (context === undefined) {
    throw new Error('useGuitarNeck must be used within GuitarNeckProvider')
  }

  return context
}
