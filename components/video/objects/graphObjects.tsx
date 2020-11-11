import React from "react";
import { Line } from "react-konva";
import { PointBuilderStage } from "../../../utils/editors/builders/pointBuilder";
import { getFieldValues } from "../../../utils/editors/functions";
import {
  FieldType,
  FinishedObjectProps,
  InProgressObjectProps,
  LabelingFieldAttributes,
  LabelingFieldValues,
} from "../../../utils/editors/types";
import { getLabelText } from "../../../utils/video/functions";
import { HoverTooltip } from "../../visualization/hoverTooltip";
import Graph, { GraphShapeProps } from "../shapes/graph";

export function getGraphProps(
  values?: LabelingFieldValues,
  attributes?: LabelingFieldAttributes,
): GraphShapeProps | null {
  const graph = values?.Graph;
  if (!graph) return null;
  const value = graph[0].value;
  if (!value) return null;
  const stroke = attributes?.Graph?.color;
  return { ...value, stroke };
}

export function GraphInProgress(
  props: InProgressObjectProps,
): JSX.Element | null {
  const { stage, value, fieldSchema } = props;
  if (stage <= PointBuilderStage.NO_POINTS) return null;
  const graphProps = getGraphProps(value, fieldSchema.attributes);
  const points = graphProps?.points.flatMap(point => [point.x, point.y]) ?? [];
  return graphProps && <Line points={points} stroke={graphProps.stroke} />;
}

export function GraphFinished(props: FinishedObjectProps): JSX.Element | null {
  const { frame, field, object, isSelected, onChange, onSelect } = props;
  const { fieldSchema } = field;
  const { perFrame, attributes } = fieldSchema;
  const values = getFieldValues({
    values: field.values,
    perFrame,
    frame,
  });
  const graphProps = getGraphProps(values, attributes);

  return (
    graphProps && (
      <HoverTooltip text={getLabelText(object)}>
        <Graph
          shapeProps={graphProps}
          object={object}
          onSelect={onSelect}
          isSelected={isSelected}
          onChange={value => {
            onChange({ [FieldType.GRAPH]: [{ frame, value }] });
          }}
        />
      </HoverTooltip>
    )
  );
}