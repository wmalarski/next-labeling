import React, { useCallback, useState } from "react";

import SelectionContext, { ObjectSelection } from "./selectionContext";

export interface SelectionProviderProps {
  children: React.ReactNode | React.ReactNode[] | null;
}

export default function SelectionProvider(
  props: SelectionProviderProps,
): JSX.Element {
  const { children } = props;

  const [selected, setSelected] = useState<ObjectSelection[]>([]);
  const [toggled, setToggled] = useState<string[]>([]);

  const select = useCallback(
    (selection: ObjectSelection[]): void => setSelected(selection),
    [],
  );

  return (
    <SelectionContext.Provider
      value={{ selected, select, toggled, toggle: setToggled }}
    >
      {children}
    </SelectionContext.Provider>
  );
}
