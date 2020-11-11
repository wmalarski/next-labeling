import Konva from "konva";
import React, { useRef, useState } from "react";
import { Rect } from "react-konva";
import { Box3dBuilderStage } from "../../../utils/editors/builders/box3dBuilder";
import { getFieldValues } from "../../../utils/editors/functions";
import {
  FieldType,
  FinishedObjectProps,
  InProgressObjectProps,
  LabelingFieldAttributes,
  LabelingFieldValues,
} from "../../../utils/editors/types";
import { Box3dValue } from "../../../utils/editors/types/box3d";
import { BoxNewSideWidth } from "../../../utils/video/constansts";
import { getLabelText } from "../../../utils/video/functions";
import { HoverTooltip } from "../../visualization/hoverTooltip";
import { BoxLeaf } from "../shapes/boxLeaf";
import { BoxSide, BoxSideShapeProps } from "../shapes/boxSide";
import { Rectangle, RectangleShapeProps } from "../shapes/rectangle";

export enum Box3dShapeType {
  LEFT = "Left",
  RIGHT = "Right",
}

export interface Box3dShapeProps {
  front: RectangleShapeProps;
  side: BoxSideShapeProps | null;
  type: Box3dShapeType | null;
}

export function getBoxSideShapeProps(
  front: RectangleShapeProps,
  type: Box3dShapeType | null,
  side: [number, number, number] | null,
): BoxSideShapeProps | null {
  if (!side) return null;
  const { x, y, width, height } = front;
  const [xs, y1, y2] = side;
  const points = [xs, y1, xs, y2];
  switch (type) {
    case Box3dShapeType.LEFT:
      return {
        stroke: front.stroke,
        points: [x, y, ...points, x, y + height],
      };
    case Box3dShapeType.RIGHT:
      return {
        stroke: front.stroke,
        points: [x + width, y, ...points, x + width, y + height],
      };
    default:
      return null;
  }
}

export function getBox3dValue(values?: LabelingFieldValues): Box3dValue | null {
  const box3d = values?.Box3d;
  if (!box3d) return null;
  return box3d[0].value ?? null;
}

export function getBox3dShapeProps(
  value: Box3dValue,
  attributes?: LabelingFieldAttributes,
): Box3dShapeProps {
  const [x1, y1, x2, y2] = value.front;
  const [x, maxX] = [x1, x2].sort((a, b) => a - b);
  const [y, maxY] = [y1, y2].sort((a, b) => a - b);

  const stroke = attributes?.Box3d?.color;
  const type = value.sideType as Box3dShapeType | null;
  const front = { x, y, width: maxX - x, height: maxY - y, stroke };
  return {
    type,
    front,
    side: getBoxSideShapeProps(front, type, value.side),
  };
}

export function Box3dInProgress(
  props: InProgressObjectProps,
): JSX.Element | null {
  const { stage, value, fieldSchema } = props;
  if (stage <= Box3dBuilderStage.ONE_POINT) return null;
  const box3dValue = getBox3dValue(value);
  return (
    box3dValue && (
      <Rect {...getBox3dShapeProps(box3dValue, fieldSchema.attributes)} />
    )
  );
}

export function Box3dFinished(props: FinishedObjectProps): JSX.Element | null {
  const { frame, field, isSelected, object, onSelect, onChange } = props;
  const { fieldSchema } = field;
  const { perFrame, attributes } = fieldSchema;

  const [isDragged, setIsDragged] = useState(false);
  const lineRef = useRef<Konva.Line>(null);
  const topRef = useRef<Konva.Circle>(null);
  const bottomRef = useRef<Konva.Circle>(null);

  const values = getFieldValues({
    values: field.values,
    perFrame,
    frame,
  });
  const value = getBox3dValue(values);
  if (!value) return null;
  const shapeProps = getBox3dShapeProps(value, attributes);
  const { front, type, side } = shapeProps;

  return (
    <HoverTooltip text={getLabelText(object)}>
      <>
        {!isDragged && isSelected && (
          <BoxLeaf
            x={front.x - 1}
            y={front.y}
            height={front.height}
            isLeft={true}
            onClick={() =>
              onChange({
                [FieldType.BOX3D]: [
                  {
                    frame,
                    value:
                      type === Box3dShapeType.LEFT
                        ? {
                            ...value,
                            sideType: null,
                            side: null,
                          }
                        : {
                            ...value,
                            sideType: Box3dShapeType.LEFT,
                            side: [
                              front.x - BoxNewSideWidth,
                              front.y,
                              front.y + front.height,
                            ],
                          },
                  },
                ],
              })
            }
          />
        )}
        {!isDragged && isSelected && (
          <BoxLeaf
            x={front.x + front.width}
            y={front.y}
            height={front.height}
            isLeft={false}
            onClick={() =>
              onChange({
                [FieldType.BOX3D]: [
                  {
                    frame,
                    value:
                      type === Box3dShapeType.RIGHT
                        ? {
                            ...value,
                            sideType: null,
                            side: null,
                          }
                        : {
                            ...value,
                            sideType: Box3dShapeType.RIGHT,
                            side: [
                              front.x + front.width + BoxNewSideWidth,
                              front.y,
                              front.y + front.height,
                            ],
                          },
                  },
                ],
              })
            }
          />
        )}
        <Rectangle
          isSelected={isSelected}
          object={object}
          rectProps={front}
          onSelect={onSelect}
          onChange={newFront => {
            const { x, y, width, height } = newFront;
            setIsDragged(false);
            onChange({
              [FieldType.BOX3D]: [
                {
                  frame,
                  value: {
                    ...value,
                    front: [x, y, x + width, y + height],
                  },
                },
              ],
            });
          }}
          onMove={newFront => {
            if (!side) return;
            const { x, y, width, height } = newFront;
            const newPoints = [...side.points];
            const newX = x + (type === Box3dShapeType.LEFT ? 0 : width);
            newPoints.splice(0, 2, newX, y);
            newPoints.splice(6, 2, newX, y + height);
            lineRef.current?.points(newPoints);
            setIsDragged(true);
          }}
        />
        {side && (
          <BoxSide
            lineRef={lineRef}
            topRef={topRef}
            bottomRef={bottomRef}
            isSelected={isSelected}
            object={object}
            shapeProps={side}
            onSelect={onSelect}
            onChange={newSide => {
              const { points } = newSide;
              setIsDragged(false);
              onChange({
                [FieldType.BOX3D]: [
                  {
                    frame,
                    value: {
                      ...value,
                      side: [points[2], points[3], points[5]],
                    },
                  },
                ],
              });
            }}
            onMove={() => {
              setIsDragged(true);
            }}
          />
        )}
      </>
    </HoverTooltip>
  );
}
