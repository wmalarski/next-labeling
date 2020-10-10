import { useEffect, useMemo } from "react";

import { calculateNewValues } from "../../editors/functions";
import setAttributeUpdate from "../../labeling/updates/setAttributeUpdate";
import useLabelingContext from "../../labeling/hooks/useLabelingContext";
import getCoordsBuilders from "../getCoordsBuilder";
import { ToolType } from "../types";
import useCoordsBuilder, { UseCoordsBuilderResult } from "./useCoordsBuilder";
import useToolContext from "./useToolContext";
import { ExtendedField, ExtendedObject } from "../../labeling/types";

export interface UseDrawingToolResult {
  builderResult: UseCoordsBuilderResult;
  object?: ExtendedObject;
  field?: ExtendedField;
}

export default function useDrawingTool(): UseDrawingToolResult {
  const { history } = useLabelingContext();
  const { pushLabeling } = history;
  const { objects, currentFrame } = history.data;

  const { objectId, setTool } = useToolContext();

  const isBuilderInProgress = !!objectId;
  const object = isBuilderInProgress
    ? objects.find(object => object.id === objectId)
    : undefined;
  const builder = useMemo(() => (getCoordsBuilders(object) ?? [])[0], [object]);
  const builderResult = useCoordsBuilder(builder);
  const { builderState } = builderResult;

  useEffect(() => {
    if (!builderState.isEnded || !builderState.lastValue || !objectId) return;
    setTool({ toolType: ToolType.SELECTOR });
    pushLabeling(data => {
      const { id, values, fieldSchema } = builder.field;
      const value = builderState.lastValue?.value;
      if (!value) return;
      return setAttributeUpdate(
        data,
        objectId,
        id,
        calculateNewValues(values, fieldSchema.perFrame, value),
      );
    });
  }, [
    builder?.field,
    currentFrame,
    builderState.isEnded,
    builderState.lastValue,
    objectId,
    pushLabeling,
    setTool,
  ]);

  return { builderResult, object, field: builder?.field };
}
