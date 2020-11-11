import StepContent from "@material-ui/core/StepContent";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { UseProjectHistoryFnc } from "../../../utils/projects/hooks/useProjectHistory";
import { ProjectDocument } from "../../../utils/projects/types";
import StepActions from "./stepActions";

export interface ProjectSchemasStepProps {
  project: ProjectDocument;
  push: UseProjectHistoryFnc;
  onPreviousClicked: () => void;
  onNextClicked: () => void;
  onSkipClicked: () => void;
}

export default function ProjectSchemasStep(
  props: ProjectSchemasStepProps,
): JSX.Element {
  const { onPreviousClicked, onNextClicked, onSkipClicked, ...other } = props;

  return (
    <StepContent {...other}>
      <Typography>Configure Project Schemas</Typography>
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
