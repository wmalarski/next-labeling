import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { useRootDispatch } from "../../common/redux/store";
import { setIsDone, setIsTracked, setName } from "../../workspace/redux/slice";
import { LabelingObject } from "../../workspace/types/client";

export interface ObjectStatusEditorProps {
  object: LabelingObject;
}

function ObjectStatusEditor(props: ObjectStatusEditorProps): JSX.Element {
  const { object } = props;

  const dispatch = useRootDispatch();

  return (
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
  );
}

export default React.memo(ObjectStatusEditor);
