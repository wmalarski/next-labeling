import React, { useCallback, useState } from "react";
import SelectionContext from "./selectionContext";

export interface SelectionProviderProps {
  children: React.ReactNode | React.ReactNode[] | null;
}

export default function SelectionProvider(
  props: SelectionProviderProps,
): JSX.Element {
  const { children } = props;
  const [selected, setSelected] = useState<string[]>([]);

  const select = useCallback(
    (id: string): void => setSelected(state => [...state, id]),
    [],
  );

  const deselect = useCallback(
    (id: string): void => setSelected(state => state.filter(sel => sel !== id)),
    [],
  );

  const clear = useCallback((): void => setSelected([]), []);

  return (
    <SelectionContext.Provider
      value={{
        selected,
        select,
        deselect,
        clear,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
}
