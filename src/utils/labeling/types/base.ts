import * as t from "io-ts";

import { LabelingFieldValues } from "../../editors/types";

export const FieldBase = {
  id: t.string,
  fieldSchemaId: t.string,
  values: LabelingFieldValues,
};

export const ObjectBase = {
  id: t.string,
  name: t.string,
  objectSchemaId: t.string,
  isDone: t.boolean,
  isTracked: t.boolean,
  frames: t.union([t.array(t.number), t.null]),
};
