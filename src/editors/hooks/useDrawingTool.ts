import isNull from "lodash/isNull";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useRootDispatch } from "../../common/redux/store";
import { addObject, setToolType } from "../../workspace/redux/slice";
import { DrawingTool, ToolType } from "../../workspace/types/client";
import getCoordsBuilders from "../builders/getCoordsBuilder";
import { drawingToolSelector } from "../redux/selectors";
import useCoordsBuilder, { UseCoordsBuilderResult } from "./useCoordsBuilder";

export interface UseDrawingToolResult {
  result: UseCoordsBuilderResult;
  tool: DrawingTool | null;
}

export default function useDrawingTool(): UseDrawingToolResult {
  const dispatch = useRootDispatch();
  const drawingTool = useSelector(drawingToolSelector);

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
    const values = builderState.lastValue?.value;
    if (!values) return;

    dispatch(addObject({ values }));
  }, [builderState.isEnded, builderState.lastValue, dispatch, resetEdit]);

  return { result: builderResult, tool: drawingTool };
}
