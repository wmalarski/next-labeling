import Paper from "@material-ui/core/Paper";
import React from "react";
import { FilterFieldsResultPair } from "../../workspace/functions";
import FieldEditor from "./fieldEditor";
import ObjectStatusEditor from "./objectStatusEditor";

export interface ObjectEditorProps {
  pair: FilterFieldsResultPair;
}

function ObjectEditor(props: ObjectEditorProps): JSX.Element {
  const { pair } = props;
  const { fields, object } = pair;

  return (
    <Paper key={object.id}>
      <ObjectStatusEditor object={object} />
      {fields.map(field => (
        <FieldEditor key={field.id} field={field} object={object} />
      ))}
    </Paper>
  );
}

export default React.memo(ObjectEditor);
