import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { useRootDispatch } from "../../common/redux/store";
import {
  currentFrameSelector,
  selectedFieldsSelector,
} from "../../workspace/redux/selectors";
import {
  setAttribute,
  setIsDone,
  setIsTracked,
  setName,
} from "../../workspace/redux/slice";
import { LabelingField, LabelingObject } from "../../workspace/types/client";
import { LabelingFieldValues } from "../types";
import FieldEditor from "./fieldEditor";

export default function EditorTable(): JSX.Element {
  const dispatch = useRootDispatch();
  const filteredObjects = useSelector(selectedFieldsSelector);
  const currentFrame = useSelector(currentFrameSelector);

  const handleChange = useCallback(
    (
      newValues: LabelingFieldValues,
      object: LabelingObject,
      field: LabelingField,
    ) =>
      dispatch(
        setAttribute({
          objectId: object.id,
          fieldId: field.id,
          values: newValues,
        }),
      ),
    [dispatch],
  );

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
                dispatch(setName({ object, name: value }));
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={object.isDone}
                  onChange={event => {
                    const checked = event.target.checked;
                    dispatch(setIsDone({ object, checked }));
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
                    dispatch(setIsTracked({ object, checked }));
                  }}
                />
              }
              label="Is tracked"
            />
          </div>
          {fields.map(field => (
            <FieldEditor
              key={field.id}
              field={field}
              disabled={object.isDone}
              frame={currentFrame}
              onChange={newValues => handleChange(newValues, object, field)}
            />
          ))}
        </Paper>
      ))}
    </>
  );
}
