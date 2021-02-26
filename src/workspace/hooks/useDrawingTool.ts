import { useEffect, useMemo } from "react";
import getCoordsBuilders from "../../editors/builders/getCoordsBuilder";
import { calculateNewValues } from "../../editors/functions";
import useCoordsBuilder, {
  UseCoordsBuilderResult,
} from "../../editors/hooks/useCoordsBuilder";
import { LabelingField, LabelingObject, ToolType } from "../types/client";
import setAttributeUpdate from "../updates/setAttributeUpdate";
import usePreferences from "./usePreferencesContext";
import useToolContext from "./useToolContext";

export interface UseDrawingToolResult {
  builderResult: UseCoordsBuilderResult;
  object?: LabelingObject;
  field?: LabelingField;
}

export default function useDrawingTool(): UseDrawingToolResult {
  const { preferences } = usePreferences();
  const { objectId, setTool } = useToolContext();

  const isBuilderInProgress = !!objectId;
  const object = isBuilderInProgress
    ? objects.find(object => object.id === objectId)
    : undefined;
  const builder = useMemo(() => (getCoordsBuilders(object) ?? [])[0], [object]);
  const builderResult = useCoordsBuilder(builder);
  const { builderState, resetEdit } = builderResult;

  useEffect(() => {
    if (!builderState.isEnded || !builderState.lastValue || !objectId) return;
    setTool({ toolType: ToolType.ZOOM_AND_PANE });
    resetEdit();
    pushLabeling(data => {
      const { id, values, fieldSchema } = builder?.field;
      const value = builderState.lastValue?.value;
      if (!value) return;
      return setAttributeUpdate(
        data,
        objectId,
        id,
        calculateNewValues(
          values,
          fieldSchema.perFrame,
          value,
          preferences.labelingDirection,
        ),
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
    preferences.labelingDirection,
    resetEdit,
  ]);

  return { builderResult, object, field: builder?.field };
}
