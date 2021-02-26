import AddBoxIcon from "@material-ui/icons/AddBox";
import compact from "lodash/compact";
import { v4 as uuidv4 } from "uuid";
import {
  UnpackedFrameValuePair,
  UnpackedFrameValues,
  unpackValues,
} from "../../../editors/functions";
import { FieldSchema } from "../../../schema/types";
import { createObject } from "../../functions";
import { addSnapshot } from "../functions";
import { currentDocumentSelector } from "../selectors";
import { WorkspaceState } from "../state";

type FieldReducer = Record<
  string,
  {
    values: UnpackedFrameValues;
    fieldSchema: FieldSchema;
  }
>;

export default function addObjectMergeAction(
  state: WorkspaceState,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const { currentFrame } = data;

  const ids = data.selected
    .filter(object => object.objectSelected)
    .map(object => object.objectId);

  const objectsToMerge = data.objects.filter(object => ids.includes(object.id));
  const uniqueSchemaId = new Set(
    objectsToMerge.map(object => object.objectSchemaId),
  );
  if (uniqueSchemaId.size > 1 || objectsToMerge.length < 2) return state;

  const frames = compact(
    Array.from(new Set(objectsToMerge.flatMap(object => object.frames))),
  );

  const fieldsValues = Object.entries(
    objectsToMerge.reduce<FieldReducer>((prevObject, object) => {
      return object.fields.reduce<FieldReducer>((prevField, field) => {
        const { values, fieldSchema, fieldSchemaId } = field;
        const unpacked = unpackValues(values);
        if (!unpacked) return prevField;
        const prevPairs = prevField[fieldSchemaId]?.values.pairs ?? [];
        return {
          ...prevField,
          [fieldSchemaId]: {
            fieldSchema,
            values: {
              type: unpacked.type,
              pairs: [...prevPairs, ...unpacked.pairs],
            },
          },
        };
      }, prevObject);
    }, {}),
  );

  const fields = fieldsValues.map(([fieldSchemaId, value]) => ({
    id: uuidv4(),
    fieldSchemaId,
    fieldSchema: value.fieldSchema,
    values: {
      [value.values.type]: value.values.pairs
        .sort((a, b) => a.frame - b.frame)
        .reduce<UnpackedFrameValuePair[]>((prev, curr) => {
          if (prev.length === 0) return [curr];
          return JSON.stringify(prev[prev.length - 1].value) ===
            JSON.stringify(curr.value)
            ? prev
            : [...prev, curr];
        }, [])
        .filter(
          (pair, index, array) =>
            array.findIndex(p => p.frame === pair.frame) === index,
        ),
    },
  }));

  const newObject = {
    ...createObject({
      objectSchema: objectsToMerge[0].objectSchema,
      currentFrame,
      defaultFields: [],
    }),
    frames,
    fields,
  };

  return addSnapshot(state, {
    id: uuidv4(),
    message: "Objects merged",
    icon: AddBoxIcon,
    data: {
      ...data,
      objects: [
        ...data.objects.filter(object => !ids.includes(object.id)),
        newObject,
      ],
    },
  });
}
