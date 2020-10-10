import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { LabelingFieldValue } from "../editors/types";
import { ExtendedObject } from "../labeling/types";
import { FieldSchema } from "../schema/types";
import getCoordsBuilders from "./coordsBuilders";
import { MouseButton } from "./types";
import useCoordsBuilder, { CoordsRefState } from "./useCoordsBuilder";

export interface UseObjectBuilderCoords {
  stage: number;
  isFinished: boolean;
  canBeFinished: boolean;
  fieldSchema?: FieldSchema;
  value?: LabelingFieldValue;
}

export interface UseObjectBuilderResult {
  finishedCoords: UseObjectBuilderCoords[];
  currentCoords: MutableRefObject<CoordsRefState>;
  pushPoint: (point: PIXI.Point) => void;
  acceptPoint: (forceFinish: boolean) => void;
  removePoint: () => void;
  resetEdit: () => void;
}

export default function useObjectBuilder(
  object?: ExtendedObject,
): UseObjectBuilderResult {
  const [finished, setFinished] = useState<UseObjectBuilderCoords[]>([]);

  const builders = useMemo(() => getCoordsBuilders(object), [object]);
  const result = useCoordsBuilder(builders[finished.length]);

  const { acceptPoint: coordsAcceptPoint } = result;
  const acceptPoint = useCallback(
    (forceFinish: boolean): void => {
      coordsAcceptPoint(forceFinish);

      const history = result.coords.current.history;
      const lastCoords = history[history.length - 1];

      if (!lastCoords.isFinished) return;
      setFinished(state => [...state, lastCoords]);
    },
    [coordsAcceptPoint, result.coords],
  );

  return {
    finishedCoords: finished,
    currentCoords: result.coords,
    pushPoint: result.pushPoint,
    removePoint: result.removePoint,
    resetEdit: result.resetEdit,
    acceptPoint,
  };
}
