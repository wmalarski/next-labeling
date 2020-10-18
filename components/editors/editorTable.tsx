import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import React, { useMemo } from "react";

import { filterSelectedFields } from "../../utils/labeling/functions";
import useLabelingContext from "../../utils/labeling/hooks/useLabelingContext";
import setAttributeUpdate from "../../utils/labeling/updates/setAttributeUpdate";
import setIsDoneUpdate from "../../utils/labeling/updates/setIsDoneUpdate";
import setIsTrackedUpdate from "../../utils/labeling/updates/setIsTrackedUpdate";
import setNameUpdate from "../../utils/labeling/updates/setNameUpdate";
import FieldEditor from "./fieldEditor";

export default function EditorTable(): JSX.Element {
  const { history } = useLabelingContext();
  const { pushLabeling, data } = history;
  const { currentFrame } = data;

  const filteredObjects = useMemo(() => filterSelectedFields(data), [data]);

  return (
    <>
      {filteredObjects.map(({ object, fields }) => (
        <Paper key={object.id}>
          <div>
            <TextField
              variant="outlined"
              fullWidth
              label="Name"
              value={object.name}
              margin="dense"
              onChange={event => {
                const value = event.target.value;
                pushLabeling(doc => setNameUpdate(doc, object, value));
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={object.isDone}
                  onChange={event => {
                    const checked = event.target.checked;
                    pushLabeling(doc => setIsDoneUpdate(doc, object, checked));
                  }}
                />
              }
              label="Done"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={object.isTracked}
                  onChange={event => {
                    const checked = event.target.checked;
                    pushLabeling(doc =>
                      setIsTrackedUpdate(doc, object, checked),
                    );
                  }}
                />
              }
              label="Is tracked"
            />
          </div>
          {fields.map(field => (
            <FieldEditor
              key={field.id}
              attributes={field.fieldSchema.attributes}
              disabled={object.isDone}
              frame={currentFrame}
              name={field.fieldSchema.name}
              perFrame={field.fieldSchema.perFrame}
              values={field.values}
              onChange={provider =>
                pushLabeling(doc =>
                  setAttributeUpdate(
                    doc,
                    object.id,
                    field.id,
                    provider(field.values),
                  ),
                )
              }
            />
          ))}
        </Paper>
      ))}
    </>
  );
}
