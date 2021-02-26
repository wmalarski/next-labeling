import { useTheme } from "@material-ui/core";
import React, { useCallback } from "react";
import { Rect } from "react-konva";
import { useSelector } from "react-redux";
import { useRootDispatch } from "../../../common/redux/store";
import { getEventRelativePosition } from "../../../visualization/functions";
import { Point2D } from "../../../visualization/types";
import { frameToRange } from "../../../workspace/functions";
import { frameStepSelector } from "../../../workspace/redux/selectors";
import {
  deselectObject,
  selectObject,
  setCurrentFrame,
} from "../../../workspace/redux/slice";
import { LabelingObject } from "../../../workspace/types/client";
import { TimelineObjectConfig } from "../../types";
import TimelineField from "./timelineField";
import TimelineRow from "./timelineRow";

export interface TimelineObjectProps extends TimelineObjectConfig {
  duration: number;
  rowHeight: number;
  selectedNodes: string[];
  onTooltipEnter: (point: Point2D, text: string) => void;
  onTooltipLeave: () => void;
}

export default function TimelineObject(
  props: TimelineObjectProps,
): JSX.Element {
  const {
    duration,
    rowHeight,
    row,
    object,
    objectBlocks,
    fieldBlocks,
    selectedNodes,
    onTooltipEnter,
    onTooltipLeave,
  } = props;
  const isSelected = selectedNodes.includes(object.id);

  const dispatch = useRootDispatch();
  const frameStep = useSelector(frameStepSelector);

  const handleSelect = useCallback(
    (object: LabelingObject, reset: boolean, fieldId?: string): void =>
      void dispatch(selectObject({ object, reset, fieldId })),
    [dispatch],
  );

  const handleDeselect = useCallback(
    (object: LabelingObject, reset: boolean, fieldId?: string): void =>
      void dispatch(deselectObject({ objectId: object.id, reset, fieldId })),
    [dispatch],
  );

  const handleFrameSelected = useCallback(
    (index: number): void =>
      void dispatch(
        setCurrentFrame({
          nextFrame: frameToRange(Number(index), duration),
          propagationStep: frameStep,
        }),
      ),
    [duration, frameStep, dispatch],
  );

  const theme = useTheme();
  const selectionColor = theme.palette.primary.light;
  const deselectionColor = theme.palette.primary.dark;

  return (
    <>
      <TimelineRow
        duration={duration}
        isSelected={isSelected}
        row={row}
        rowHeight={rowHeight}
        onClick={event => {
          if (event.evt.altKey) {
            const position = getEventRelativePosition(event);
            if (position) handleFrameSelected(position.x);
            return;
          }
          const isReset = !event.evt.ctrlKey;
          if (!isSelected) handleSelect(object, isReset);
          else handleDeselect(object, isReset);
        }}
      >
        {objectBlocks.map(block => (
          <Rect
            key={block.firstFrame}
            x={block.firstFrame}
            y={row * rowHeight}
            width={block.lastFrame + 1 - block.firstFrame}
            height={rowHeight - 3}
            fill={isSelected ? selectionColor : deselectionColor}
          />
        ))}
      </TimelineRow>
      {fieldBlocks.map((pair, index) => (
        <TimelineField
          key={pair.field.id}
          {...pair}
          row={row + index + 1}
          duration={duration}
          rowHeight={rowHeight}
          object={object}
          selectedNodes={selectedNodes}
          onSelect={handleSelect}
          onDeselect={handleDeselect}
          onFrameSelected={handleFrameSelected}
          onTooltipEnter={onTooltipEnter}
          onTooltipLeave={onTooltipLeave}
        />
      ))}
    </>
  );
}
