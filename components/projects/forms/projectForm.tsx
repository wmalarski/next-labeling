import Button from "@material-ui/core/Button";
import React from "react";
import useProjectHistory, {
  ProjectStep,
} from "../../../utils/projects/hooks/useProjectHistory";

import { ProjectDocument } from "../../../utils/projects/types";
import ProjectGeneralForm from "./projectGeneralForm";

export interface ProjectFormProps {
  project: ProjectDocument;
  onSubmit: (project: ProjectDocument) => void;
}

export default function ProjectForm(props: ProjectFormProps): JSX.Element {
  const { project: initialProject, onSubmit } = props;

  const { project, push } = useProjectHistory(
    initialProject,
    ProjectStep.GENERAL,
    10,
  );

  return (
    <div>
      <ProjectGeneralForm project={project} push={push} />
      <Button onClick={() => onSubmit(project)}>Save</Button>
    </div>
  );
}
