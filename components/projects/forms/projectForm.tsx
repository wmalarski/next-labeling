import Button from "@material-ui/core/Button";
import React, { useCallback, useState } from "react";

import { ProjectDocument } from "../../../utils/projects/types";
import ProjectGeneralForm from "./projectGeneralForm";

export interface ProjectFormProps {
  project: ProjectDocument;
  onSubmit: (project: ProjectDocument) => void;
}

export default function ProjectForm(props: ProjectFormProps): JSX.Element {
  const { project, onSubmit } = props;

  const [document, setDocument] = useState<ProjectDocument>(project);

  const pushProject = useCallback(
    (provider: (doc: ProjectDocument) => ProjectDocument): void =>
      setDocument(provider),
    [],
  );

  return (
    <div>
      <ProjectGeneralForm document={document} pushProject={pushProject} />
      <Button onClick={() => onSubmit(document)}>Save</Button>
    </div>
  );
}
