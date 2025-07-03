'use client'

import React, { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode } from "react";

export type BreadcrumbItem = { label: string; href?: string };
type BreadcrumbContextType = {
  items: BreadcrumbItem[];
  setItems: Dispatch<SetStateAction<BreadcrumbItem[]>>;
};

const defaultValue: BreadcrumbContextType = {
  items: [],
  setItems: () => {},
};

const BreadcrumbContext = createContext<BreadcrumbContextType>(defaultValue);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BreadcrumbItem[]>([]);

  return (
    <BreadcrumbContext.Provider value={{ items, setItems }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  return useContext(BreadcrumbContext);
}
