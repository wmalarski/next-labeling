import { createContext } from "react";

export interface SelectionContextValue {
  selected: string[];
  select: (id: string) => void;
  deselect: (id: string) => void;
  clear: () => void;
}

const SelectionContext = createContext<SelectionContextValue>({
  selected: [],
  select: () => void 0,
  deselect: () => void 0,
  clear: () => void 0,
});

export default SelectionContext;
