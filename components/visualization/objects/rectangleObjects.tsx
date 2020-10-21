import React from "react";
import { Rect } from "react-konva";

import { getFieldValue } from "../../../utils/editors/functions";
import {
  FieldType,
  LabelingFieldAttributes,
  LabelingFieldValues,
} from "../../../utils/editors/types";
import { RectangleBuilderStage } from "../../../utils/visualization/objects/rectangleBuilder";
import {
  FinishedObjectProps,
  InProgressObjectProps,
} from "../../../utils/visualization/types";
import { Rectangle, RectangleShapeProps } from "../shapes/rectangle";

export function getRectProps(
  values?: LabelingFieldValues,
  attributes?: LabelingFieldAttributes,
): RectangleShapeProps | null {
  const rectangle = values?.Rectangle;
  if (!rectangle) return null;
  const value = rectangle[0].value;
  if (!value) return null;
  const [x1, y1, x2, y2] = value;
  const [minX, maxX] = [x1, x2].sort((a, b) => a - b);
  const [minY, maxY] = [y1, y2].sort((a, b) => a - b);
  const stroke = attributes?.Rectangle?.color;
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY, stroke };
}

export function RectangleInProgress(
  props: InProgressObjectProps,
): JSX.Element | null {
  const { stage, value, fieldSchema } = props;
  if (stage <= RectangleBuilderStage.ONE_POINT) return null;
  const rectProps = getRectProps(value, fieldSchema.attributes);
  return rectProps && <Rect {...rectProps} />;
}

export function RectangleFinished(
  props: FinishedObjectProps,
): JSX.Element | null {
  const { frame, field, isSelected, object, onSelect, onChange } = props;
  const { fieldSchema } = field;
  const { perFrame, attributes } = fieldSchema;
  const rectProps = getRectProps(
    getFieldValue({
      values: field.values,
      perFrame,
      frame,
    }),
    attributes,
  );

  return (
    rectProps && (
      <Rectangle
        isSelected={isSelected}
        object={object}
        onSelect={onSelect}
        rectProps={rectProps}
        onChange={rect =>
          onChange({
            [FieldType.RECTANGLE]: [
              {
                frame,
                value: [
                  rect.x,
                  rect.y,
                  rect.x + rect.width,
                  rect.y + rect.height,
                ],
              },
            ],
          })
        }
      />
    )
  );
}
