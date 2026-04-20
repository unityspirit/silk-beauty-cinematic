import React, { createContext, useContext, useState } from 'react';

interface ScrollContextType {
  progress: number;
  setProgress: (val: number) => void;
  activeIndex: number;
  setActiveIndex: (val: number) => void;
}

export const ScrollContext = createContext<ScrollContextType>({
  progress: 0,
  setProgress: () => {},
  activeIndex: 0,
  setActiveIndex: () => {},
});

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <ScrollContext.Provider value={{ progress, setProgress, activeIndex, setActiveIndex }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScrollProgress = () => useContext(ScrollContext);
