import React from "react";

import { Rect } from "react-konva";
import { getFieldValue } from "../../../utils/editors/functions";
import { RectangleBuilderStage } from "../../../utils/visualization/objects/rectangle";
import {
  FinishedObjectProps,
  InProgressObjectProps,
} from "../../../utils/visualization/types";

export function RectangleInProgress(
  props: InProgressObjectProps,
): JSX.Element | null {
  const rectangle = props.value.Rectangle;
  if (!rectangle) return null;
  const value = rectangle[0].value;
  if (!value || props.stage <= RectangleBuilderStage.ONE_POINT) return null;

  const [x1, y1, x2, y2] = value;
  const [minX, maxX] = [x1, x2].sort();
  const [minY, maxY] = [y1, y2].sort();

  return (
    <Rect
      x={minX}
      y={minY}
      width={maxX - minX}
      height={maxY - minY}
      stroke="red"
    />
  );
}

export function RectangleFinished(
  props: FinishedObjectProps,
): JSX.Element | null {
  const { frame, field } = props;
  const values = getFieldValue({
    perFrame: field.fieldSchema.perFrame,
    values: field.values,
    frame,
  })?.Rectangle;
  if (!values || !values[0].value) return null;

  const [x1, y1, x2, y2] = values[0].value;
  const [minX, maxX] = [x1, x2].sort();
  const [minY, maxY] = [y1, y2].sort();

  return (
    <Rect
      x={minX}
      y={minY}
      width={maxX - minX}
      height={maxY - minY}
      stroke="red"
    />
  );
}
