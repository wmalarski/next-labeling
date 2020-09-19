import { createContext } from "react";

export interface ObjectSelection {
  objectId: string;
  objectSelected: boolean;
  fieldIds: string[];
  singleton: boolean;
}

export interface SelectionContextValue {
  selected: ObjectSelection[];
  select: (selection: ObjectSelection[]) => void;
  toggled: string[];
  toggle: (ids: string[]) => void;
}

const SelectionContext = createContext<SelectionContextValue>({
  selected: [],
  select: () => void 0,
  toggled: [],
  toggle: () => void 0,
});

export default SelectionContext;
