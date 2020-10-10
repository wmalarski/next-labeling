import { ObjectSchema } from "../../schema/types";
import { createObject } from "../functions";
import { ExtendedLabeling } from "../types";
import { LabelingState } from "../hooks/useLabelingHistory";

export default function addObjectUpdate(
  data: ExtendedLabeling,
  objectSchema: ObjectSchema,
  currentFrame: number,
): [string, LabelingState] {
  const object = createObject(objectSchema, currentFrame);
  return [
    object.id,
    {
      message: "Object created",
      data: {
        ...data,
        objects: [...data.objects, object],
        selected: [
          {
            fieldIds: [],
            objectId: object.id,
            objectSelected: true,
            singleton: objectSchema.singleton,
          },
        ],
      },
    },
  ];
}
