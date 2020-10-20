import React from "react";
import { Line } from "react-konva";

import { getFieldValue } from "../../../utils/editors/functions";
import {
  FieldType,
  LabelingFieldAttributes,
  LabelingFieldValues,
} from "../../../utils/editors/types";
import { PolygonBuilderStage } from "../../../utils/visualization/objects/polygon";
import {
  FinishedObjectProps,
  InProgressObjectProps,
} from "../../../utils/visualization/types";
import Sections from "./sections";

export interface PolygonProps {
  points: number[];
  stroke?: string;
  closed?: boolean;
  opacity?: number;
}

export function getPolygonProps(
  values?: LabelingFieldValues,
  attributes?: LabelingFieldAttributes,
): PolygonProps | null {
  const polygon = values?.Polygon;
  if (!polygon) return null;
  const points = polygon[0].value;
  if (!points) return null;
  const stroke = attributes?.Polygon?.color;
  return { points, stroke, closed: true, opacity: 0.1 };
}

export function PolygonInProgress(
  props: InProgressObjectProps,
): JSX.Element | null {
  const { stage, value, fieldSchema } = props;
  if (stage <= PolygonBuilderStage.ONE_POINT) return null;
  const polygonProps = getPolygonProps(value, fieldSchema.attributes);
  return polygonProps && <Line {...polygonProps} />;
}

export function PolygonFinished(
  props: FinishedObjectProps,
): JSX.Element | null {
  const { frame, field, object, isSelected, onChange, onSelect } = props;
  const { isDone } = object;
  const { fieldSchema } = field;
  const { perFrame, attributes } = fieldSchema;
  const values = getFieldValue({
    values: field.values,
    perFrame,
    frame,
  });
  const polygonProps = getPolygonProps(values, attributes);

  return (
    polygonProps && (
      <Sections
        {...polygonProps}
        isDone={isDone}
        onSelect={onSelect}
        isSelected={isSelected}
        onChange={newPoints => {
          onChange({ [FieldType.LINE]: [{ frame, value: newPoints }] });
        }}
      />
    )
  );
}
