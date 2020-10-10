import { useContext } from "react";

import LabelingContext, {
  LabelingContextValue,
} from "../contexts/labelingContext";

export default function useLabelingContext(): LabelingContextValue {
  return useContext(LabelingContext);
}
