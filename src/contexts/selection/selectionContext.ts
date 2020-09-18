import { createContext } from "react";
import { LabelingObject } from "../../utils/labeling/types";

export interface SelectionContextValue {
  selected: LabelingObject[];
  clearAndSelect: (ids: string[]) => void;
  select: (id: string) => void;
  deselect: (id: string) => void;
  clear: () => void;
}

const SelectionContext = createContext<SelectionContextValue>({
  selected: [],
  clearAndSelect: () => void 0,
  select: () => void 0,
  deselect: () => void 0,
  clear: () => void 0,
});

export default SelectionContext;
