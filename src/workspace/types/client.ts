import * as t from "io-ts";
import { FieldSchema, ObjectSchema } from "../../schema/types";
import { FieldBase, ObjectBase } from "./base";

export const ObjectSelection = t.strict({
  objectId: t.string,
  objectSelected: t.boolean,
  fieldIds: t.array(t.string),
  singleton: t.boolean,
});
export type ObjectSelection = t.TypeOf<typeof ObjectSelection>;

export const LabelingField = t.strict({
  ...FieldBase,
  fieldSchema: FieldSchema,
});
export type LabelingField = t.TypeOf<typeof LabelingField>;

export const LabelingObject = t.strict({
  ...ObjectBase,
  objectSchema: ObjectSchema,
  fields: t.array(LabelingField),
});
export type LabelingObject = t.TypeOf<typeof LabelingObject>;

export const LabelingDocument = t.strict({
  objects: t.array(LabelingObject),
  currentFrame: t.number,
  selected: t.array(ObjectSelection),
  toggled: t.array(t.string),
});
export type LabelingDocument = t.TypeOf<typeof LabelingDocument>;

export enum IsDoneFilterValue {
  ALL,
  IS_DONE,
  WIP,
}

export enum ToolType {
  SELECTOR,
  ZOOM_AND_PANE,
  DRAWING_TOOL,
}

export interface DrawingTool {
  fieldSchema: FieldSchema;
  objectSchema: ObjectSchema;
}

export interface LabelingDisplayFilters {
  objectSchemaIds: string[];
  name?: string | null;
  isDone: IsDoneFilterValue;
}

export enum LabelingAction {
  SET_ATTRIBUTE,
  ADD_OBJECT_COPY,
  ADD_OBJECT,
  SET_SNAPSHOT,
  SELECTION_CHANGE,
  DELETE_BACKWARD,
  DELETE_FORWARD,
  DELETE_OBJECTS,
  SET_IS_DONE,
  SET_IS_TRACKED,
  SET_NAME,
  FRAME_CHANGE_FORWARD,
  FRAME_CHANGE_BACKWARD,
}
