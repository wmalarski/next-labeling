import * as t from "io-ts";
import { AuthUser } from "../auth/types";
import { ReactionsArray } from "../comments/types";

export const WorkflowNode = t.strict({
  name: t.string,
  description: t.string,
  roles: t.array(t.string),
});
export type WorkflowNode = t.TypeOf<typeof WorkflowNode>;

export const WorkflowEdge = t.strict({
  name: t.string,
  description: t.string,
  fromNode: t.string,
  toNode: t.string,
  roles: t.array(t.string),
});
export type WorkflowEdge = t.TypeOf<typeof WorkflowEdge>;

export const WorkflowDocument = t.strict({
  name: t.string,
  description: t.string,
  roles: t.array(t.string),
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
  contributors: t.array(t.strict({ user: t.string, roles: t.array(t.string) })),
  schemas: t.array(t.string),
  workflow: WorkflowDocument,
});
export type ProjectDocument = t.TypeOf<typeof ProjectDocument>;

export interface ProjectDocumentPair {
  id: string;
  project: ProjectDocument;
}
