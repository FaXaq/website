"use client"

import React, { createContext, Dispatch, SetStateAction } from 'react';
import { Analysis } from '../types';

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
}

export const useCustomFileContext = () => React.useContext(CustomFileContext);