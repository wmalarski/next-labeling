import { useContext, useEffect, useMemo } from "react";

import LabelingContext from "../../contexts/labeling/labelingContext";
import ToolContext, { ToolType } from "../../contexts/tool/toolContext";
import { calculateNewValues } from "../editors/functions";
import setAttributeUpdate from "../labeling/updates/setAttributeUpdate";
import getCoordsBuilders from "./coordsBuilders";
import useCoordsFactory, { UseCoordsFactoryResult } from "./useCoordsFactory";

export default function useDrawingTool(): UseCoordsFactoryResult {
  const { history } = useContext(LabelingContext);
  const { setLabeling } = history;
  const { objects, currentFrame } = history.data;

  const { objectId, setTool } = useContext(ToolContext);

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
    setLabeling(data => {
      const { id, values, fieldSchema } = builder.field;
      const result = Object.entries(values)[0];
      if (!result) return;

      const [key, oldValues] = result;
      const newValues = calculateNewValues(oldValues, fieldSchema.perFrame, {
        frame: currentFrame,
        value: factoryState.lastValue,
      });
      return {
        message: "Coords saved",
        data: setAttributeUpdate(data, objectId, id, { [key]: newValues }),
      };
    });
  }, [
    builder.field,
    currentFrame,
    factoryState.isEnded,
    factoryState.lastValue,
    objectId,
    setLabeling,
    setTool,
  ]);

  return result;
}
