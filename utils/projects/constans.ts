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
  roles: ["owner", "user"],
  schemas: [],
  reactions: [],
  tags: [],
  workflow: {
    name: "My Pipeline",
    description: "Default pipeline",
    edges: [
      {
        name: "Start",
        description: "Start work on task",
        fromNode: "To Do",
        toNode: "In Progress",
        action: {
          roles: ["user"],
          users: [],
        },
      },
      {
        name: "Review",
        description: "Review requested",
        fromNode: "In Progress",
        toNode: "In Review",
        action: {
          roles: ["user"],
          users: [],
        },
      },
      {
        name: "Rejected",
        description: "Labeling rejected",
        fromNode: "In Review",
        toNode: "In Progress",
        action: {
          roles: ["owner"],
          users: [],
        },
      },
      {
        name: "Accept",
        description: "Labeling accepted",
        fromNode: "In Review",
        toNode: "Done",
        action: {
          roles: ["owner"],
          users: [],
        },
      },
      {
        name: "Correction",
        description: "Labeling needs to be corrected",
        fromNode: "Done",
        toNode: "To Do",
        action: {
          roles: ["owner"],
          users: [],
        },
      },
    ],
    nodes: [
      {
        name: "To Do",
        description: "Task to do",
        read: {
          roles: ["owner", "user"],
          users: [],
        },
        write: {
          roles: [],
          users: [],
        },
      },
      {
        name: "In Progress",
        description: "Task currently in progress",
        read: {
          roles: ["owner", "user"],
          users: [],
        },
        write: {
          roles: ["user"],
          users: [],
        },
      },
      {
        name: "In Review",
        description: "Task to do",
        read: {
          roles: ["owner", "user"],
          users: [],
        },
        write: {
          roles: ["owner"],
          users: [],
        },
      },
      {
        name: "Done",
        description: "Done tasks",
        read: {
          roles: ["owner", "user"],
          users: [],
        },
        write: {
          roles: [],
          users: [],
        },
      },
    ],
  },
};
