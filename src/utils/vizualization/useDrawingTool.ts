import { useEffect, useMemo } from "react";

import { calculateNewValues } from "../editors/functions";
import setAttributeUpdate from "../labeling/updates/setAttributeUpdate";
import useLabelingContext from "../labeling/useLabelingContext";
import getCoordsBuilders from "./coordsBuilders";
import { ToolType } from "./types";
import useCoordsFactory, { UseCoordsFactoryResult } from "./useCoordsFactory";
import useToolContext from "./useToolContext";

export default function useDrawingTool(): UseCoordsFactoryResult {
  const { history } = useLabelingContext();
  const { pushLabeling } = history;
  const { objects, currentFrame } = history.data;

  const { objectId, setTool } = useToolContext();

  const isBuilderInProgress = !!objectId;
  const object = isBuilderInProgress
    ? objects.find(object => object.id === objectId)
    : undefined;
  const builder = useMemo(() => (getCoordsBuilders(object) ?? [])[0], [object]);
  const result = useCoordsFactory(builder);
  const { factoryState } = result;

  useEffect(() => {
    if (!factoryState.isEnded || !factoryState.lastValue || !objectId) return;
    setTool({ toolType: ToolType.SELECTOR });
    pushLabeling(data => {
      const { id, values, fieldSchema } = builder.field;
      const result = Object.entries(values)[0];
      if (!result) return;

      const [key, oldValues] = result;
      const newValues = calculateNewValues(oldValues, fieldSchema.perFrame, {
        frame: currentFrame,
        value: factoryState.lastValue,
      });
      return setAttributeUpdate(data, objectId, id, { [key]: newValues });
    });
  }, [
    builder.field,
    currentFrame,
    factoryState.isEnded,
    factoryState.lastValue,
    objectId,
    pushLabeling,
    setTool,
  ]);

  return result;
}
