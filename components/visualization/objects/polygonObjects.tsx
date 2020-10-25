import React from "react";
import { Line } from "react-konva";

import { getFieldValues } from "../../../utils/editors/functions";
import {
  FieldType,
  LabelingFieldAttributes,
  LabelingFieldValues,
} from "../../../utils/editors/types";
import { LineBuilderStage } from "../../../utils/visualization/objects/lineBuilder";
import {
  FinishedObjectProps,
  InProgressObjectProps,
} from "../../../utils/visualization/types";
import Sections, { SectionsShapeProps } from "../shapes/sections";

export function getSectionsProps(
  values?: LabelingFieldValues,
  attributes?: LabelingFieldAttributes,
): SectionsShapeProps | null {
  const polygon = values?.Polygon;
  if (!polygon) return null;
  const points = polygon[0].value;
  if (!points) return null;
  const stroke = attributes?.Polygon?.color;
  return { points, stroke, closed: true, opacity: 0.9 };
}

export function PolygonInProgress(
  props: InProgressObjectProps,
): JSX.Element | null {
  const { stage, value, fieldSchema } = props;
  if (stage <= LineBuilderStage.ONE_POINT) return null;
  const polygonProps = getSectionsProps(value, fieldSchema.attributes);
  return polygonProps && <Line {...polygonProps} />;
}

export function PolygonFinished(
  props: FinishedObjectProps,
): JSX.Element | null {
  const { frame, field, object, isSelected, onChange, onSelect } = props;
  const { fieldSchema } = field;
  const { perFrame, attributes } = fieldSchema;
  const values = getFieldValues({
    values: field.values,
    perFrame,
    frame,
  });
  const sectionsProps = getSectionsProps(values, attributes);

  return (
    sectionsProps && (
      <Sections
        sectionsProps={sectionsProps}
        object={object}
        onSelect={onSelect}
        isSelected={isSelected}
        onChange={value => {
          onChange({ [FieldType.LINE]: [{ frame, value: value.points }] });
        }}
      />
    )
  );
}
