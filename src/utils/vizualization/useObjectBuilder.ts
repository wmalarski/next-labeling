import { useEffect, useMemo, useState } from "react";

import { LabelingFieldValue } from "../editors/types";
import { ExtendedObject } from "../labeling/types";
import { FieldSchema } from "../schema/types";
import getCoordsBuilders from "./coordsBuilders";
import useCoordsBuilder from "./useCoordsBuilder";

export interface UseObjectBuilderCoords {
  stage: number;
  isFinished: boolean;
  canBeFinished: boolean;
  fieldSchema?: FieldSchema;
  value?: LabelingFieldValue;
}

export interface UseObjectBuilderResult {
  coords: UseObjectBuilderCoords[];
  current: UseObjectBuilderCoords;
  pushPoint: (point: PIXI.Point) => void;
  acceptPoint: (isFinished: boolean) => void;
  removePoint: () => void;
  resetEdit: () => void;
}

export default function useObjectBuilder(
  object?: ExtendedObject,
): UseObjectBuilderResult {
  const [finished, setFinished] = useState<UseObjectBuilderCoords[]>([]);

  const builders = useMemo(() => getCoordsBuilders(object), [object]);
  const result = useCoordsBuilder(builders[finished.length]);

  useEffect(() => {
    console.log("result", result);
  }, [result]);

  const current = useMemo(
    () => ({
      canBeFinished: result.canBeFinished,
      isFinished: result.isFinished,
      stage: result.stage,
      fieldSchema: result.fieldSchema,
      value: result.value,
    }),
    [result],
  );

  // console.log("finished", { finished, current });

  useEffect(() => {
    if (current.isFinished) {
      setFinished(finished => [...finished, current]);
    }
  }, [builders, current]);

  return {
    coords: finished,
    current,
    acceptPoint: result.acceptPoint,
    pushPoint: result.pushPoint,
    removePoint: result.removePoint,
    resetEdit: result.resetEdit,
  };
}
