import isNull from "lodash/isNull";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useRootDispatch } from "../../common/redux/store";
import getCoordsBuilders from "../../editors/builders/getCoordsBuilder";
import useCoordsBuilder, {
  UseCoordsBuilderResult,
} from "../../editors/hooks/useCoordsBuilder";
import {
  currentFrameSelector,
  drawingToolSelector,
  labelingDirectionSelector,
} from "../redux/selectors";
import { setToolType } from "../redux/slice";
import { ToolType } from "../types/client";

export default function useDrawingTool(): UseCoordsBuilderResult {
  const dispatch = useRootDispatch();
  const drawingTool = useSelector(drawingToolSelector);
  const labelingDirection = useSelector(labelingDirectionSelector);
  const currentFrame = useSelector(currentFrameSelector);

  const builder = useMemo(
    () => (!isNull(drawingTool) ? getCoordsBuilders(drawingTool) : null),
    [drawingTool],
  );
  const builderResult = useCoordsBuilder(builder);
  const { builderState, resetEdit } = builderResult;

  useEffect(() => {
    if (!builderState.isEnded || !builderState.lastValue) return;
    dispatch(setToolType(ToolType.ZOOM_AND_PANE));
    resetEdit();
    const value = builderState.lastValue?.value;
    if (!value || !drawingTool) return;

    // dispatch(
    //   addObject({
    //     objectSchemaId: drawingTool,
    //     defaultFields: [
    //       {
    //         fieldId: drawingTool,
    //         values: calculateNewValues(
    //           values,
    //           fieldSchema.perFrame,
    //           value,
    //           labelingDirection,
    //         ),
    //       },
    //     ],
    //   }),
    // );
  }, [
    currentFrame,
    builderState.isEnded,
    builderState.lastValue,
    labelingDirection,
    resetEdit,
    dispatch,
    drawingTool,
  ]);

  return builderResult;
}
