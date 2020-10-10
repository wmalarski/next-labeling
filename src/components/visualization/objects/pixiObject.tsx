import React from "react";

import { FieldType } from "../../../utils/editors/types";
import { PixiObjectProps } from "../../../utils/vizualization/types";
import Rectangle from "./rectangle";

export default function PixiObject(props: PixiObjectProps): JSX.Element {
  const { attributes } = props.fieldSchema;
  const type = Object.keys(attributes)[0];

  switch (type) {
    case FieldType.RECTANGLE:
      return <Rectangle {...props} />;
    default:
      return <></>;
  }
}
