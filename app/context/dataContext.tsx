// src/context/DataContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

type DataContextType = {
  data: any[];
  addData: (newData: any) => void;
  editData: (id: number, updatedData: any) => void;
  deleteData: (id: number) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

type DataProviderProps = {
  children: ReactNode;
};

export const DataProvider = ({ children }: DataProviderProps) => {
  const [data, setData] = useState<any[]>([]);

  const addData = (newData: any) => {
    setData((prevData) => [...prevData, newData]);
  };

  const editData = (id: number, updatedData: any) => {
    setData((prevData) =>
      prevData.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );
  };

  const deleteData = (id: number) => {
    setData((prevData) => prevData.filter((item) => item.id !== id));
  };

  return (
    <DataContext.Provider value={{ data, addData, editData, deleteData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
