import type { Reducer} from 'react';
import React, { createContext, useContext, useReducer } from 'react';

type ActivePoint = {
  x: number,
  y: number,
  index: number
}

interface ActiveChartPointContextState {
  activePoint: ActivePoint,
  setActivePoint: (payload: ActivePoint) => void,
}

const INITIAL_STATE: ActiveChartPointContextState = {
  activePoint: { x: -1, y: -1, index: -1 },
  setActivePoint: () => { throw new Error('Function not implemented.'); }
};

enum ACTION_TYPE {
    SET = 'SET'
}

const ActiveChartPointContext = createContext(INITIAL_STATE);

const ActiveChartPointReducer: Reducer<ActiveChartPointContextState, { type: ACTION_TYPE, payload: ActivePoint }> = (state, action) => {
  const { type, payload } = action;

  switch (type) {
  case ACTION_TYPE.SET:
    return {
      ...state,
      activePoint: payload
    };
  default:
  }

  return { ...state };
};

interface ProviderProps {
  children: React.ReactNode
}

export function ActiveChartPointProvider({ children }: ProviderProps) {
  const [state, dispatch] = useReducer(ActiveChartPointReducer, INITIAL_STATE);

  const setActivePoint = (activePoint: ActivePoint) => {
    dispatch({ type: ACTION_TYPE.SET, payload: activePoint });
  };

  const value: ActiveChartPointContextState = {
    activePoint: state.activePoint,
    setActivePoint
  };

  return (
    <ActiveChartPointContext.Provider value={value}>
      {children}
    </ActiveChartPointContext.Provider>
  );
}

export const useActiveChartPoint = () => {
  const context = useContext(ActiveChartPointContext);

  if (context === undefined) {
    throw new Error('useActiveChartPoint must be used within ActiveChartPointProvider');
  }

  return context;
};
