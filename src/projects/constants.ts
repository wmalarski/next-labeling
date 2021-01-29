import { ProjectDocument } from "./types";

export const defaultProjectDocument: ProjectDocument = {
  createdAt: undefined,
  author: {
    displayName: "",
    email: "",
    emailVerified: false,
    id: "",
  },
  contributors: [],
  description: "My favorite project",
  isPublic: true,
  name: "My Project",
  schemas: [],
  reactions: [],
  tags: [],
  workflow: {
    name: "My Pipeline",
    description: "Default pipeline",
    roles: ["owner", "user"],
    edges: [
      {
        name: "Start",
        description: "Start work on task",
        fromNode: "To Do",
        toNode: "In Progress",
        roles: ["user"],
      },
      {
        name: "Review",
        description: "Review requested",
        fromNode: "In Progress",
        toNode: "In Review",
        roles: ["user"],
      },
      {
        name: "Rejected",
        description: "Labeling rejected",
        fromNode: "In Review",
        toNode: "In Progress",
        roles: ["owner"],
      },
      {
        name: "Accept",
        description: "Labeling accepted",
        fromNode: "In Review",
        toNode: "Done",
        roles: ["owner"],
      },
      {
        name: "Correction",
        description: "Labeling needs to be corrected",
        fromNode: "Done",
        toNode: "To Do",
        roles: ["owner"],
      },
    ],
    nodes: [
      {
        name: "To Do",
        description: "Task to do",
        roles: [],
      },
      {
        name: "In Progress",
        description: "Task currently in progress",
        roles: ["user"],
      },
      {
        name: "In Review",
        description: "Task to do",
        roles: ["owner"],
      },
      {
        name: "Done",
        description: "Done tasks",
        roles: [],
      },
    ],
  },
};
