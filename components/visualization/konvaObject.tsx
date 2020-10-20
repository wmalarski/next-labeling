import React from "react";

import { FieldType } from "../../utils/editors/types";
import {
  FinishedObjectProps,
  InProgressObjectProps,
} from "../../utils/visualization/types";
import { LineFinished, LineInProgress } from "./objects/line";
import { PointFinished, PointInProgress } from "./objects/point";
import { PolygonFinished, PolygonInProgress } from "./objects/polygon";
import { RectangleFinished, RectangleInProgress } from "./objects/rectangle";

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
    default:
      return null;
  }
}
