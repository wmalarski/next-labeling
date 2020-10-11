import * as t from "io-ts";
import { AuthUser } from "../auth/user";
import { ObjectSelection } from "../labeling/types/client";
import { ExternalObject } from "../labeling/types/database";

export const CommentSnapshot = t.strict({
  objects: t.union([t.array(ExternalObject), t.null]),
  currentFrame: t.number,
  selected: t.array(ObjectSelection),
  toggled: t.array(t.string),
});
export type CommentSnapshot = t.TypeOf<typeof CommentSnapshot>;

export const CommentDocument = t.strict({
  id: t.union([t.string, t.undefined]),
  labelingId: t.string,
  parentId: t.union([t.string, t.null]),
  user: AuthUser,
  resolved: t.boolean,
  createDate: t.string,
  isEdited: t.boolean,
  isThread: t.boolean,
  message: t.string,
  snapshot: t.union([CommentSnapshot, t.null]),
  reactions: t.array(
    t.strict({
      type: t.string,
      count: t.number,
    }),
  ),
});
export type CommentDocument = t.TypeOf<typeof CommentDocument>;
