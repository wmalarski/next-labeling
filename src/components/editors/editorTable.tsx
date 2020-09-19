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
  const { history, document } = useContext(LabelingContext);
  const { selected } = useContext(SelectionContext);

  const { objects: schemaObjects } = document.schema;
  const { objects } = history.data;

  selected.flatMap(selectedObject => {
    const object = objects.find(
      object => object.id === selectedObject.objectId,
    );
    if (!object) return [];
    const objectSchema = schemaObjects.find(
      schema => schema.id === object.schemaObjectId,
    );
    if (!objectSchema) return [];
  });

  return (
    <div>
      <pre>{JSON.stringify(document.data, null, 2)}</pre>
    </div>
  );
}
