import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Paper from "@material-ui/core/Paper";
import React, { useContext } from "react";

import FramesContext from "../../contexts/frames/framesContext";
import LabelingContext from "../../contexts/labeling/labelingContext";
import SelectionContext from "../../contexts/selection/selectionContext";
import { ExtendedField, ExtendedObject } from "../../utils/labeling/types";
import {
  changeAttributeUpdate,
  changeIsDoneUpdate,
  changeisTrackedUpdate,
} from "../../utils/labeling/updates";
import FieldEditor from "./fieldEditor";

export interface TableObject {
  object: ExtendedObject;
  fields: ExtendedField[];
}

export default function EditorTable(): JSX.Element {
  const { history } = useContext(LabelingContext);
  const { selected } = useContext(SelectionContext);
  const { currentFrame } = useContext(FramesContext);

  const { objects } = history.data;

  const tableObjects: TableObject[] = selected.flatMap(selection => {
    const object = objects.find(object => object.id === selection.objectId);
    if (!object) return [];
    const isInFrame = object.frames?.includes(currentFrame) ?? true;
    return [
      {
        object,
        fields: (selection.objectSelected
          ? object.fields
          : selection.fieldIds.flatMap(fieldId => {
              const field = object.fields.find(f => f.id === fieldId);
              return field ? [field] : [];
            })
        ).filter(field => !field.fieldSchema.perFrame || isInFrame),
      },
    ];
  });

  return (
    <>
      {tableObjects.map(({ object, fields }) => (
        <Paper key={object.id}>
          <div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={object.isDone}
                  onChange={event => {
                    const checked = event.target.checked;
                    history.setLabeling(data => ({
                      message: "Is Done changed",
                      data: changeIsDoneUpdate(data, object, checked),
                    }));
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
                    history.setLabeling(data => ({
                      message: "Is tracked changed",
                      data: changeisTrackedUpdate(data, object, checked),
                    }));
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
                history.setLabeling(data => ({
                  message: "Attribute value changed",
                  data: changeAttributeUpdate(
                    data,
                    object,
                    field,
                    provider(field.values),
                  ),
                }))
              }
            />
          ))}
          <pre>{JSON.stringify(object, null, 2)}</pre>
        </Paper>
      ))}
    </>
  );
}
