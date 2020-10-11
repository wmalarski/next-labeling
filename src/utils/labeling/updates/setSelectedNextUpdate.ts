import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import { LabelingState } from "../hooks/useLabelingHistory";
import { ExtendedLabeling } from "../types";

export default function setSelectedNextUpdate(
  data: ExtendedLabeling,
  change: number,
): LabelingState {
  const { currentFrame, objects, selected } = data;

  const selectedIds = selected
    .filter(object => object.objectSelected)
    .map(object => object.objectId);

  const objectsInFrame = objects.filter(object =>
    object.frames?.includes(currentFrame),
  );
  const firstSelectedIndex = objectsInFrame.findIndex(object =>
    selectedIds.includes(object.id),
  );

  const nextSelectedIndex =
    firstSelectedIndex === -1
      ? 0
      : (firstSelectedIndex + change + objectsInFrame.length) %
        objectsInFrame.length;

  const firstObject = objectsInFrame[nextSelectedIndex];
  return {
    message: "Selection changed",
    icon: NavigateNextIcon,
    data: {
      ...data,
      selected: firstObject
        ? [
            {
              fieldIds: firstObject.fields.map(field => field.id),
              singleton: firstObject.objectSchema.singleton,
              objectId: firstObject.id,
              objectSelected: true,
            },
          ]
        : [],
    },
  };
}
