import { ExtendedLabeling, ObjectSelection } from "../types";

export default function setSelectedUpdate(
  data: ExtendedLabeling,
  selected: ObjectSelection[],
): ExtendedLabeling {
  return { ...data, selected };
}
