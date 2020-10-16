import StepContent from "@material-ui/core/StepContent";
import Typography from "@material-ui/core/Typography";
import React from "react";

import { UseProjectHistoryFnc } from "../../../utils/projects/hooks/useProjectHistory";
import { ProjectDocument } from "../../../utils/projects/types";
import ProjectWorkflowForm from "../forms/projectWorkflowForm";
import StepActions from "./stepActions";

export interface ProjectWorkflowStepProps {
  project: ProjectDocument;
  push: UseProjectHistoryFnc;
  onPreviousClicked: () => void;
  onNextClicked: () => void;
  onSkipClicked: () => void;
}

export default function ProjectWorkflowStep(
  props: ProjectWorkflowStepProps,
): JSX.Element {
  const {
    project,
    push,
    onPreviousClicked,
    onNextClicked,
    onSkipClicked,
    ...other
  } = props;

  return (
    <StepContent {...other}>
      <Typography>Configure Project Workflow</Typography>
      <ProjectWorkflowForm project={project} push={push} />
      <StepActions
        nextDisabled={false}
        previousVisible={true}
        onNextClicked={onNextClicked}
        onPreviousClicked={onPreviousClicked}
        onSkipClicked={onSkipClicked}
      />
    </StepContent>
  );
}
