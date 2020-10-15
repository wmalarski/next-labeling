import Step from "@material-ui/core/Step";
import StepContent from "@material-ui/core/StepContent";
import StepLabel from "@material-ui/core/StepLabel";
import Typography from "@material-ui/core/Typography";
import React from "react";

import {
  ProjectChangeFnc,
  ProjectDocument,
} from "../../../utils/projects/types";
import ProjectGeneralForm from "../forms/projectGeneralForm";
import StepActions from "./stepActions";

export interface ProjectGeneralStepProps {
  document: ProjectDocument;
  pushProject: ProjectChangeFnc;
  onNextClicked: () => void;
  onSkipClicked: () => void;
}

export default function ProjectGeneralStep(
  props: ProjectGeneralStepProps,
): JSX.Element {
  const {
    document,
    pushProject,
    onNextClicked,
    onSkipClicked,
    ...other
  } = props;

  const isValid = 0 < document.name.length && document.name.length < 30;

  return (
    <StepContent {...other}>
      <Typography>Configure general settings</Typography>
      <ProjectGeneralForm document={document} pushProject={pushProject} />
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
