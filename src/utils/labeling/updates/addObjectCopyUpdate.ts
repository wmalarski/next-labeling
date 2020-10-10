import { v4 as uuidv4 } from "uuid";

import { ExtendedLabeling } from "../types";
import { LabelingState } from "../useLabelingHistory";

export default function addObjectCopyUpdate(
  data: ExtendedLabeling,
  ids: string[],
): LabelingState {
  return {
    message: "Objects copied",
    data: {
      ...data,
      objects: [
        ...data.objects,
        ...data.objects
          .filter(object => ids.includes(object.id))
          .map(object => ({
            ...object,
            id: uuidv4(),
            name: `${object.name} - Copy`,
            fields: object.fields.map(field => ({
              ...field,
              id: uuidv4(),
            })),
          })),
      ],
    },
  };
}
