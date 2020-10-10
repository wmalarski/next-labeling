import { ObjectSchema } from "../../schema/types";
import { createObject } from "../functions";
import { ExtendedLabeling, ExtendedObject } from "../types";

export default function addObjectUpdate(
  data: ExtendedLabeling,
  objectSchema: ObjectSchema,
  currentFrame: number,
): [ExtendedObject, ExtendedLabeling] {
  const object = createObject(objectSchema, currentFrame);
  return [
    object,
    {
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
  ];
}
