import isNaN from "lodash/isNil";
import React, { useCallback, useContext, useMemo, useState } from "react";

import { LabelingObject } from "../../utils/labeling/types";
import LabelingContext from "../labeling/labelingContext";
import SelectionContext from "./selectionContext";

export interface SelectionProviderProps {
  children: React.ReactNode | React.ReactNode[] | null;
}

export default function SelectionProvider(
  props: SelectionProviderProps,
): JSX.Element {
  const { children } = props;

  const labeling = useContext(LabelingContext);

  const [selectedIds, setSelected] = useState<string[]>([]);

  const select = useCallback(
    (id: string): void => setSelected(state => [...state, id]),
    [],
  );

  const deselect = useCallback(
    (id: string): void => setSelected(state => state.filter(sel => sel !== id)),
    [],
  );

  const clearAndSelect = useCallback(
    (ids: string[]): void => setSelected(ids),
    [],
  );

  const selected = useMemo(() => {
    const objects: LabelingObject[] = labeling.document.objects;
    return selectedIds
      .map(object => objects.find(inner => inner.id === object))
      .filter(object => object !== undefined) as LabelingObject[]; // TODO: find why casting is wrong
  }, [labeling.document.objects, selectedIds]);

  const clear = useCallback((): void => setSelected([]), []);

  return (
    <SelectionContext.Provider
      value={{
        selected,
        clearAndSelect,
        select,
        deselect,
        clear,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
}
