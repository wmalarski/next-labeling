import { useTheme } from "@material-ui/core";
import Konva from "konva";
import { KonvaEventObject } from "konva/types/Node";
import React, { useRef } from "react";
import { Group, Rect } from "react-konva";
import useMouseHover from "../../visualization/hooks/useMouseHover";
import { TimelineHoverStroke } from "../constants";

const hoverProps = { strokeWidth: TimelineHoverStroke };
const outProps = { strokeWidth: 0 };

export interface TimelineRowProps {
  row: number;
  duration: number;
  rowHeight: number;
  isSelected: boolean;
  children: JSX.Element | JSX.Element[];
  onClick: (evt: KonvaEventObject<MouseEvent>) => void;
}

export default function TimelineRow(props: TimelineRowProps): JSX.Element {
  const { isSelected, duration, rowHeight, row, children, onClick } = props;

  const theme = useTheme();
  const selectionColor = theme.palette.primary.light;
  const deselectionColor = theme.palette.primary.dark;
  const hoverStrokeColor = theme.palette.text.primary;

  const rectRef = useRef<Konva.Rect>(null);
  const fillRef = useRef<Konva.Rect>(null);
  const hoverCallbacks = useMouseHover(rectRef, hoverProps, outProps);

  return (
    <Group
      x={0}
      height={rowHeight}
      width={duration}
      {...hoverCallbacks}
      onClick={onClick}
    >
      <Rect
        ref={fillRef}
        y={row * rowHeight}
        height={rowHeight - 3}
        width={duration}
        fill={isSelected ? selectionColor : deselectionColor}
        opacity={0.1}
      />
      <Rect
        ref={rectRef}
        y={row * rowHeight}
        height={rowHeight - 3}
        width={duration}
        stroke={hoverStrokeColor}
        strokeWidth={0}
        dash={[2, 2]}
      />
      {children}
    </Group>
  );
}
