import React from "react";

import { ProjectDocument } from "../../utils/projects/types";

export interface ProjectFormProps {
  onSubmit: (project: ProjectDocument) => void;
}

export default function ProjectForm(props: ProjectFormProps): JSX.Element {
  return <></>;
}
