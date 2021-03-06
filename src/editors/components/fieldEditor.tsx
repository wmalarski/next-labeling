import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { useRootDispatch } from "../../common/redux/store";
import { currentFrameSelector } from "../../workspace/redux/selectors";
import { setAttribute } from "../../workspace/redux/slice";
import { LabelingField, LabelingObject } from "../../workspace/types/client";
import { LabelingFieldValues } from "../types";
import FieldEditorSwitch from "./fieldEditorSwitch";

export interface FieldObjectEditorProps {
  object: LabelingObject;
  field: LabelingField;
}

export function FieldEditor(props: FieldObjectEditorProps): JSX.Element {
  const { object, field } = props;

  const dispatch = useRootDispatch();

  const currentFrame = useSelector(currentFrameSelector);

  const handleChange = useCallback(
    (newValues: LabelingFieldValues) =>
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
    <FieldEditorSwitch
      field={field}
      disabled={object.isDone}
      frame={currentFrame}
      onChange={handleChange}
    />
  );
}

export default React.memo(FieldEditor);
