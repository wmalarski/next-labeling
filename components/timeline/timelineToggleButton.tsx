import { useTheme } from "@material-ui/core";
import Konva from "konva";
import React, { useMemo, useRef } from "react";
import { Line, Rect } from "react-konva";
import useMouseHover from "../../utils/timeline/hooks/useMouseHover";
import { TimelineObjectShapeConfig } from "../../utils/timeline/types";

export interface TimelineToggleButtonProps extends TimelineObjectShapeConfig {
  width: number;
  rowHeight: number;
  horPadding: number;
  verPadding: number;
  onToggle: (id: string) => void;
}

export default function TimelineToggleButton(
  props: TimelineToggleButtonProps,
): JSX.Element {
  const {
    rowHeight,
    row,
    object,
    isToggled,
    width,
    horPadding,
    verPadding,
    onToggle,
  } = props;
  const { id } = object;

  const theme = useTheme();
  const textStroke = theme.palette.text.primary;
  const yShift = row * rowHeight;

  const lineRef = useRef<Konva.Line>(null);

  const hoverProps = useMemo(() => ({ strokeWidth: 2 }), []);
  const outProps = useMemo(() => ({ strokeWidth: 1 }), []);
  const hoverCallbacks = useMouseHover(lineRef, hoverProps, outProps);

  return (
    <>
      <Line
        ref={lineRef}
        stroke={textStroke}
        strokeWidth={1}
        shadowEnabled
        points={
          !isToggled
            ? [
                horPadding,
                yShift + verPadding,
                width / 2,
                yShift + rowHeight - verPadding,
                width - horPadding,
                yShift + verPadding,
              ]
            : [
                horPadding,
                yShift + rowHeight - verPadding,
                width / 2,
                yShift + verPadding,
                width - horPadding,
                yShift + rowHeight - verPadding,
              ]
        }
      />
      <Rect
        x={0}
        y={yShift}
        height={rowHeight}
        width={width}
        onClick={() => onToggle(id)}
        {...hoverCallbacks}
      />
    </>
  );
}
