import FileCopyIcon from "@material-ui/icons/FileCopy";
import compact from "lodash/compact";
import { v4 as uuidv4 } from "uuid";
import { getFieldValues, unpackValues } from "../../../editors/functions";
import { createObject } from "../../functions";
import { addSnapshot } from "../functions";
import { currentDocumentSelector } from "../selectors";
import { WorkspaceState } from "../state";

export default function addObjectCopyFrameAction(
  state: WorkspaceState,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const { currentFrame } = data;

  const ids = data.selected
    .filter(object => object.objectSelected)
    .map(object => object.objectId);

  return addSnapshot(state, {
    id: uuidv4(),
    message: "Objects frame copied",
    icon: FileCopyIcon,
    data: {
      ...data,
      objects: data.objects.flatMap(object => {
        if (!ids.includes(object.id)) return [object];
        const newObject = createObject(object.objectSchema, currentFrame);
        return [
          object,
          {
            ...newObject,
            fields: compact(
              object.fields.map(field => {
                const currentValue = getFieldValues({
                  values: field.values,
                  perFrame: field.fieldSchema.perFrame,
                  frame: currentFrame,
                });
                const unpacked = currentValue && unpackValues(currentValue);
                if (!unpacked) return null;

                const value = unpacked.pairs[0]?.value;
                if (!value) return null;

                return {
                  ...field,
                  id: uuidv4(),
                  values: { [unpacked.type]: [{ frame: currentFrame, value }] },
                };
              }),
            ),
          },
        ];
      }),
    },
  });
}
