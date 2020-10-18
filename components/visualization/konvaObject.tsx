import React from "react";

import { FieldType } from "../../utils/editors/types";
import {
  FinishedObjectProps,
  InProgressObjectProps,
} from "../../utils/visualization/types";
import { RectangleFinished, RectangleInProgress } from "./objects/reactangle";

export function InProgressObject(
  props: InProgressObjectProps,
): JSX.Element | null {
  const { attributes } = props.fieldSchema;
  const type = Object.keys(attributes)[0];

  switch (type) {
    case FieldType.RECTANGLE:
      return <RectangleInProgress {...props} />;
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
    default:
      return null;
  }
}
