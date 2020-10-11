import FileCopyIcon from "@material-ui/icons/FileCopy";
import { v4 as uuidv4 } from "uuid";

import { LabelingState } from "../hooks/useLabelingHistory";
import { ExtendedLabeling } from "../types";

export default function addObjectCopyUpdate(
  data: ExtendedLabeling,
  ids: string[],
): LabelingState {
  return {
    message: "Objects copied",
    icon: FileCopyIcon,
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
