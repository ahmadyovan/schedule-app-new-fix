// app/context/ScheduleContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface DataItem {
  id: number;
  matakuliah: string;
  jurusan: string;
  semester: string;
  waktu: string;
}

interface ScheduleContextType {
  items: DataItem[];
  saveData: (newItems: DataItem[]) => void;
  addItem: (item: Omit<DataItem, 'id'>) => void;
  deleteItem: (id: number) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

const STORAGE_KEY = 'jadwal';

export function ScheduleProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<DataItem[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedData = window.localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        try {
          setItems(JSON.parse(storedData));
        } catch (error) {
          console.error('Error parsing data:', error);
        }
      }
    }
  }, []);

  const saveData = (newItems: DataItem[]) => {
    setItems(newItems);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    }
  };

  const addItem = (item: Omit<DataItem, 'id'>) => {
    const newItem = { id: Date.now(), ...item };
    const updatedItems = [...items, newItem];
    saveData(updatedItems);
  };

  const deleteItem = (id: number) => {
    const updatedItems = items.filter(item => item.id !== id);
    saveData(updatedItems);
  };

  return (
    <ScheduleContext.Provider value={{ items, saveData, addItem, deleteItem }}>
      {children}
    </ScheduleContext.Provider>
  );
}

export function useSchedule() {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
}