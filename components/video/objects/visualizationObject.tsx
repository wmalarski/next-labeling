import React from "react";
import {
  FieldType,
  FinishedObjectProps,
  InProgressObjectProps,
} from "../../../utils/editors/types";
import { Box3dFinished, Box3dInProgress } from "./box3dObjects";
import { EyeFinished, EyeInProgress } from "./eyeObjects";
import { GraphFinished, GraphInProgress } from "./graphObjects";
import { LineFinished, LineInProgress } from "./lineObjects";
import { PointFinished, PointInProgress } from "./pointObjects";
import { PolygonFinished, PolygonInProgress } from "./polygonObjects";
import { RectangleFinished, RectangleInProgress } from "./rectangleObjects";

export function InProgressObject(
  props: InProgressObjectProps,
): JSX.Element | null {
  const { attributes } = props.fieldSchema;
  const type = Object.keys(attributes)[0];

  switch (type) {
    case FieldType.RECTANGLE:
      return <RectangleInProgress {...props} />;
    case FieldType.LINE:
      return <LineInProgress {...props} />;
    case FieldType.POLYGON:
      return <PolygonInProgress {...props} />;
    case FieldType.POINT:
      return <PointInProgress {...props} />;
    case FieldType.EYE:
      return <EyeInProgress {...props} />;
    case FieldType.GRAPH:
      return <GraphInProgress {...props} />;
    case FieldType.BOX3D:
      return <Box3dInProgress {...props} />;
    default:
      return null;
  }
}

export function FinishedObject(props: FinishedObjectProps): JSX.Element | null {
  const { attributes } = props.field.fieldSchema;
  const type = Object.keys(attributes)[0];

  switch (type) {
    case FieldType.RECTANGLE:
      return <RectangleFinished {...props} />;
    case FieldType.LINE:
      return <LineFinished {...props} />;
    case FieldType.POLYGON:
      return <PolygonFinished {...props} />;
    case FieldType.POINT:
      return <PointFinished {...props} />;
    case FieldType.EYE:
      return <EyeFinished {...props} />;
    case FieldType.GRAPH:
      return <GraphFinished {...props} />;
    case FieldType.BOX3D:
      return <Box3dFinished {...props} />;
    default:
      return null;
  }
}
