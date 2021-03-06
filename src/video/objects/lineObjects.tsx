import React from "react";
import { Line } from "react-konva";
import { LineBuilderStage } from "../../editors/builders/lineBuilder";
import { getFieldValues } from "../../editors/functions";
import {
  FieldType,
  FinishedObjectProps,
  InProgressObjectProps,
  LabelingFieldAttributes,
  LabelingFieldValues,
} from "../../editors/types";
import { HoverTooltip } from "../../visualization/components/hoverTooltip";
import { getLabelText } from "../functions";
import Sections, { SectionsShapeProps } from "../shapes/sections";

export function getSectionsProps(
  values?: LabelingFieldValues,
  attributes?: LabelingFieldAttributes,
): SectionsShapeProps | null {
  const line = values?.Line;
  if (!line) return null;
  const points = line[0].value;
  if (!points) return null;
  const stroke = attributes?.Line?.color;
  return { points, stroke };
}

export function LineInProgress(
  props: InProgressObjectProps,
): JSX.Element | null {
  const { stage, value, fieldSchema } = props;
  if (stage <= LineBuilderStage.ONE_POINT) return null;
  const lineProps = getSectionsProps(value, fieldSchema.attributes);
  return lineProps && <Line {...lineProps} />;
}

export function LineFinished(props: FinishedObjectProps): JSX.Element | null {
  const { frame, field, object, isSelected, onChange, onSelect } = props;
  const { fieldSchema } = field;
  const { perFrame, attributes } = fieldSchema;
  const values = getFieldValues({
    values: field.values,
    perFrame,
    frame,
  });
  const lineProps = getSectionsProps(values, attributes);

  return (
    lineProps && (
      <HoverTooltip text={getLabelText(object)}>
        <Sections
          sectionsProps={lineProps}
          object={object}
          onSelect={onSelect}
          isSelected={isSelected}
          onChange={value => {
            onChange({ [FieldType.LINE]: [{ frame, value: value.points }] });
          }}
        />
      </HoverTooltip>
    )
  );
}
