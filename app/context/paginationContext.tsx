'use client';

import React, { createContext, useContext, useState } from 'react';

interface PaginationContextProps<T> {
  data: T[];
  paginatedData: T[];
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  setData: React.Dispatch<React.SetStateAction<T[]>>;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
}

const PaginationContext = createContext<PaginationContextProps<any> | null>(null);

export function PaginationProvider<T>({
  children,
  rowsPerPage = 5,
}: {
  children: React.ReactNode;
  rowsPerPage?: number;
}) {
  const [data, setData] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const previousPage = () => goToPage(currentPage - 1);

  return (
    <PaginationContext.Provider
      value={{
        data,
        paginatedData,
        currentPage,
        totalPages,
        rowsPerPage,
        setData,
        goToPage,
        nextPage,
        previousPage,
      }}
    >
      {children}
    </PaginationContext.Provider>
  );
}

export function usePaginationContext<T>() {
  const context = useContext(PaginationContext);
  if (!context) {
    throw new Error('usePaginationContext must be used within a PaginationProvider');
  }
  return context as PaginationContextProps<T>;
}
