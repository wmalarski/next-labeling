import React from "react";

import { FieldType } from "../../utils/editors/types";
import {
  PixiFinishedObjectProps,
  PixiInProgressObjectProps,
} from "../../utils/visualization/types";
import {
  RectangleBuilderStage,
  RectangleInProgress,
} from "../../utils/visualization/objects/rectangle";

export function PixiInProgressObject(
  props: PixiInProgressObjectProps,
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

export function PixiFinishedObject(
  props: PixiFinishedObjectProps,
): JSX.Element {
  const { attributes } = props.fieldSchema;
  const type = Object.keys(attributes)[0];

  switch (type) {
    case FieldType.RECTANGLE:
      return (
        <RectangleInProgress
          {...props}
          stage={RectangleBuilderStage.TWO_POINTS}
        />
      );
    default:
      return <></>;
  }
}
