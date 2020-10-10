import { LabelingFieldValue } from "../editors/types";
import { FieldSchema } from "../schema/types";

export interface PixiObjectProps {
  stage: number;
  isFinished: boolean;
  canBeFinished: boolean;
  fieldSchema: FieldSchema;
  value: LabelingFieldValue;
}
