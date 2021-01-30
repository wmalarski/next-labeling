import * as t from "io-ts";
import { AuthUser } from "../auth/types";
import { ObjectSelection } from "../workspace/types/client";
import { ExternalObject } from "../workspace/types/database";

export const ReactionsArray = t.array(
  t.strict({
    type: t.string,
    count: t.number,
  }),
);
export type ReactionsArray = t.TypeOf<typeof ReactionsArray>;

export const CommentSnapshot = t.strict({
  objects: t.union([t.array(ExternalObject), t.null]),
  currentFrame: t.number,
  selected: t.array(ObjectSelection),
  toggled: t.array(t.string),
});
export type CommentSnapshot = t.TypeOf<typeof CommentSnapshot>;

export const CommentDocument = t.strict({
  parentId: t.union([t.string, t.null]),
  createdAt: t.unknown,
  user: AuthUser,
  isThread: t.boolean,
  isResolved: t.boolean,
  isEdited: t.boolean,
  isAction: t.boolean,
  message: t.string,
  snapshot: t.union([CommentSnapshot, t.null]),
  reactions: ReactionsArray,
});
export type CommentDocument = t.TypeOf<typeof CommentDocument>;

export interface CommentDocumentPair {
  id: string;
  comment: CommentDocument;
}
