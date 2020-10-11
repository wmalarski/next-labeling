import AddBoxIcon from "@material-ui/icons/AddBox";

import { ObjectSchema } from "../../schema/types";
import { createObject } from "../functions";
import { LabelingState } from "../hooks/useLabelingHistory";
import { LabelingDocument } from "../types/client";

export default function addObjectUpdate(
  data: LabelingDocument,
  objectSchema: ObjectSchema,
  currentFrame: number,
): [string, LabelingState] {
  const object = createObject(objectSchema, currentFrame);
  return [
    object.id,
    {
      message: `${object.name} created`,
      icon: AddBoxIcon,
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
