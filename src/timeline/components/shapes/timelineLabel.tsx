import { useTheme } from "@material-ui/core";
import Konva from "konva";
import React, { useRef } from "react";
import { Line, Rect, Text } from "react-konva";
import { TimelineObjectConfig } from "../../types";
import useMouseHover from "../../../visualization/hooks/useMouseHover";

const hoverProps = { strokeWidth: 2 };
const outProps = { strokeWidth: 1 };

export interface TimelineLabelProps extends TimelineObjectConfig {
  arrowWidth: number;
  rowHeight: number;
  horPadding: number;
  verPadding: number;
  onToggle: (id: string) => void;
}

export default function TimelineLabel(props: TimelineLabelProps): JSX.Element {
  const {
    rowHeight,
    row,
    object,
    isToggled,
    arrowWidth,
    horPadding,
    verPadding,
    fieldBlocks,
    onToggle,
  } = props;
  const { id, name } = object;

  const theme = useTheme();
  const textStroke = theme.palette.text.primary;
  const yShift = row * rowHeight;

  const lineRef = useRef<Konva.Line>(null);
  const hoverCallbacks = useMouseHover(lineRef, hoverProps, outProps);

  const textCommonProps = {
    fill: textStroke,
    fontSize: rowHeight / 2,
    padding: 2,
    height: rowHeight,
    ...hoverCallbacks,
  };

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
                arrowWidth / 2,
                yShift + rowHeight - verPadding,
                arrowWidth - horPadding,
                yShift + verPadding,
              ]
            : [
                horPadding,
                yShift + rowHeight - verPadding,
                arrowWidth / 2,
                yShift + verPadding,
                arrowWidth - horPadding,
                yShift + rowHeight - verPadding,
              ]
        }
      />
      <Rect
        x={0}
        y={yShift}
        height={rowHeight}
        width={arrowWidth}
        onClick={() => onToggle(id)}
        {...hoverCallbacks}
      />
      <Text x={arrowWidth} y={yShift} text={name} {...textCommonProps} />
      {fieldBlocks.map((pair, index) => (
        <Text
          key={pair.field.id}
          x={arrowWidth + 10}
          y={yShift + (index + 1) * rowHeight}
          text={pair.field.fieldSchema.name}
          {...textCommonProps}
        />
      ))}
    </>
  );
}
