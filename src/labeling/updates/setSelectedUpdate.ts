import SelectAllIcon from "@material-ui/icons/SelectAll";
import { getFrames } from "../functions";
import { LabelingState } from "../hooks/useLabelingHistory";
import { LabelingDocument, ObjectSelection } from "../types/client";

export default function setSelectedUpdate(
  data: LabelingDocument,
  selected: ObjectSelection[],
): LabelingState | undefined {
  const { currentFrame } = data;
  const ids = data.selected.map(selection => selection.objectId);
  const newIds = selected
    .filter(selection => !ids.includes(selection.objectId))
    .map(selection => selection.objectId);

  const frames = getFrames(data, newIds);
  const newFrame =
    frames.length === 0 || frames.includes(currentFrame)
      ? currentFrame
      : Math.min(...frames);

  return {
    message: "Selection changed",
    icon: SelectAllIcon,
    data: { ...data, selected, currentFrame: newFrame },
  };
}
