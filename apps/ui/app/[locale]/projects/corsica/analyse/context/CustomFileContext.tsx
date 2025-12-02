"use client";

import type { Analysis } from '@repo/schemas/api/procedures/corsica';
import type { Dispatch, SetStateAction } from 'react';
import React, { createContext, useContext } from 'react';

interface CustomFileContextType {
  analysis?: Analysis;
  setAnalysis: Dispatch<SetStateAction<Analysis | undefined>>;
}

export const CustomFileContext = createContext<CustomFileContextType | undefined>(undefined);

export const CustomFileProvider = ({ children }: { children: React.ReactNode}) => {
  const [analysis, setAnalysis] = React.useState<Analysis | undefined>(undefined);

  return (
    <CustomFileContext.Provider value={{ analysis, setAnalysis }}>
      {children}
    </CustomFileContext.Provider>
  );
};

export const useCustomFileContext = () => {
  const context = useContext(CustomFileContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};