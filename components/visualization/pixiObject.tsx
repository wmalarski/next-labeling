import React from "react";

import { FieldType } from "../../utils/editors/types";
import {
  FinishedObjectProps,
  InProgressObjectProps,
} from "../../utils/visualization/types";
import {
  RectangleFinished,
  RectangleInProgress,
} from "../../utils/visualization/objects/rectangle";

export function PixiInProgressObject(
  props: InProgressObjectProps,
): JSX.Element {
  const { attributes } = props.fieldSchema;
  const type = Object.keys(attributes)[0];

  switch (type) {
    case FieldType.RECTANGLE:
      return <RectangleInProgress {...props} />;
    default:
      return <></>;
  }
}

export function PixiFinishedObject(props: FinishedObjectProps): JSX.Element {
  const { attributes } = props.field.fieldSchema;
  const type = Object.keys(attributes)[0];

  switch (type) {
    case FieldType.RECTANGLE:
      return <RectangleFinished {...props} />;
    default:
      return <></>;
  }
}
