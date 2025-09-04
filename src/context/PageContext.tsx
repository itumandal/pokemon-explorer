import React, { createContext, useContext, useState } from 'react';

interface IPageContextType {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const PageContext = createContext<IPageContextType | undefined>(undefined);

export const PageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [page, setPage] = useState(1);

  return <PageContext.Provider value={{ page, setPage }}>{children}</PageContext.Provider>;
};

export const usePage = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error('usePage must be used within PageProvider');
  }
  return context;
};
