import StepContent from "@material-ui/core/StepContent";
import Typography from "@material-ui/core/Typography";
import React from "react";

import { UseProjectHistoryFnc } from "../../../utils/projects/hooks/useProjectHistory";
import { ProjectDocument } from "../../../utils/projects/types";
import ProjectGeneralForm from "../forms/projectGeneralForm";
import StepActions from "./stepActions";

export interface ProjectGeneralStepProps {
  project: ProjectDocument;
  push: UseProjectHistoryFnc;
  onNextClicked: () => void;
  onSkipClicked: () => void;
}

export default function ProjectGeneralStep(
  props: ProjectGeneralStepProps,
): JSX.Element {
  const { project, push, onNextClicked, onSkipClicked, ...other } = props;

  const isValid = 0 < project.name.length && project.name.length < 30;

  return (
    <StepContent {...other}>
      <Typography>Configure general settings</Typography>
      <ProjectGeneralForm project={project} push={push} />
      <StepActions
        nextDisabled={!isValid}
        previousVisible={false}
        onNextClicked={onNextClicked}
        onPreviousClicked={() => void 0}
        onSkipClicked={onSkipClicked}
      />
    </StepContent>
  );
}
