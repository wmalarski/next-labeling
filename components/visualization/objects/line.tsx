import React from "react";
import { Line } from "react-konva";

import { getFieldValue } from "../../../utils/editors/functions";
import { FieldType } from "../../../utils/editors/types";
import { LineBuilderStage } from "../../../utils/visualization/objects/line";
import {
  FinishedObjectProps,
  InProgressObjectProps,
} from "../../../utils/visualization/types";
import Sections from "./sections";

export function LineInProgress(
  props: InProgressObjectProps,
): JSX.Element | null {
  const line = props.value.Line;
  if (!line) return null;
  const value = line[0].value;
  if (!value || props.stage <= LineBuilderStage.ONE_POINT) return null;

  return <Line points={value} stroke="red" />;
}

export function LineFinished(props: FinishedObjectProps): JSX.Element | null {
  const { frame, field, onChange } = props;
  const perFrame = field.fieldSchema.perFrame;
  const values = getFieldValue({
    values: field.values,
    perFrame,
    frame,
  })?.Line;

  if (!values || !values[0].value) return null;
  const points = values[0].value;

  return (
    <Sections
      points={points}
      onChange={newPoints => {
        onChange({ [FieldType.LINE]: [{ frame, value: newPoints }] });
      }}
    />
  );
}
