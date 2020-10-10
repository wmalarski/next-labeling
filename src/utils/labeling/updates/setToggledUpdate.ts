import { ExtendedLabeling } from "../types";

export default function setToggledUpdate(
  data: ExtendedLabeling,
  toggled: string[],
): ExtendedLabeling {
  return { ...data, toggled };
}
