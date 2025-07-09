"use client";

import React, {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";

export type BreadcrumbItem = { label: string; href?: string };
type BreadcrumbContextType = {
  items: BreadcrumbItem[];
  setItems: Dispatch<SetStateAction<BreadcrumbItem[]>>;
  pushItem: (item: BreadcrumbItem) => void;
};

const defaultValue: BreadcrumbContextType = {
  items: [],
  setItems: () => {},
  pushItem: () => {},
};

const BreadcrumbContext = createContext<BreadcrumbContextType>(defaultValue);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BreadcrumbItem[]>([]);

  function pushItem(item: BreadcrumbItem) {
    setItems((prev) => {
      if (prev.some((b) => b.href === item.href)) return prev;
      return [...prev, item];
    });
  }

  return (
    <BreadcrumbContext.Provider value={{ items, setItems, pushItem }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  return useContext(BreadcrumbContext);
}
