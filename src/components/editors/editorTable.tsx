import React, { useContext } from "react";

import LabelingContext from "../../contexts/labeling/labelingContext";
import SelectionContext from "../../contexts/selection/selectionContext";
import { LabelingField, LabelingObject } from "../../utils/labeling/types";
import { FieldSchema, ObjectSchema } from "../../utils/schema/types";

export interface TableObject {
  object: LabelingObject;
  objectSchema: ObjectSchema;
  fields: {
    field: LabelingField;
    fieldSchema: FieldSchema;
  };
}

export default function EditorTable(): JSX.Element {
  const { history } = useContext(LabelingContext);
  const { selected } = useContext(SelectionContext);

  const { objects } = history.data;

  selected.flatMap(selection => {
    const object = objects.find(object => object.id === selection.objectId);
    if (!object) return [];
  });

  return (
    <div>
      <pre>{JSON.stringify(history.data, null, 2)}</pre>
    </div>
  );
}
