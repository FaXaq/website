"use client";

import type { Dispatch, SetStateAction } from 'react';
import React, { createContext } from 'react';

import type { Analysis } from '../types';

interface CustomFileContextType {
  analysis: Analysis;
  setAnalysis: Dispatch<SetStateAction<Analysis>>;
}

export const CustomFileContext = createContext<CustomFileContextType>(undefined);

export const CustomFileProvider = ({ children }: { children: React.ReactNode}) => {
  const [analysis, setAnalysis] = React.useState<Analysis>(undefined);

  return (
    <CustomFileContext.Provider value={{ analysis, setAnalysis }}>
      {children}
    </CustomFileContext.Provider>
  );
};

export const useCustomFileContext = () => React.useContext(CustomFileContext);