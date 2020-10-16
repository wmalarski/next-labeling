import * as t from "io-ts";
import { AuthUser } from "../auth/user";
import { ReactionsArray } from "../comments/types";

export const WorkflowAccess = t.strict({
  roles: t.array(t.string),
  users: t.array(t.string),
});
export type WorkflowAccess = t.TypeOf<typeof WorkflowAccess>;

export const WorkflowNode = t.strict({
  name: t.string,
  description: t.string,
  read: WorkflowAccess,
  write: WorkflowAccess,
});
export type WorkflowNode = t.TypeOf<typeof WorkflowNode>;

export const WorkflowEdge = t.strict({
  name: t.string,
  description: t.string,
  fromNode: t.string,
  toNode: t.string,
  action: WorkflowAccess,
});
export type WorkflowEdge = t.TypeOf<typeof WorkflowEdge>;

export const WorkflowDocument = t.strict({
  name: t.string,
  description: t.string,
  nodes: t.array(WorkflowNode),
  edges: t.array(WorkflowEdge),
});
export type WorkflowDocument = t.TypeOf<typeof WorkflowDocument>;

export const ProjectDocument = t.strict({
  name: t.string,
  description: t.string,
  tags: t.array(t.string),
  createdAt: t.unknown,
  isPublic: t.boolean,
  reactions: ReactionsArray,
  author: AuthUser,
  roles: t.array(t.string),
  contributors: t.array(t.strict({ user: t.string, roles: t.array(t.string) })),
  schemas: t.array(t.string),
  workflow: WorkflowDocument,
});
export type ProjectDocument = t.TypeOf<typeof ProjectDocument>;

export interface ProjectDocumentPair {
  id: string;
  project: ProjectDocument;
}
