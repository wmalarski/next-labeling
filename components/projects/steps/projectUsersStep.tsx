import StepContent from "@material-ui/core/StepContent";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { UseProjectHistoryFnc } from "../../../utils/projects/hooks/useProjectHistory";
import { ProjectDocument } from "../../../utils/projects/types";
import StepActions from "./stepActions";

export interface ProjectUsersStepProps {
  project: ProjectDocument;
  push: UseProjectHistoryFnc;
  onPreviousClicked: () => void;
  onNextClicked: () => void;
  onSkipClicked: () => void;
}

export default function ProjectUsersStep(
  props: ProjectUsersStepProps,
): JSX.Element {
  const { onPreviousClicked, onNextClicked, onSkipClicked, ...other } = props;

  return (
    <StepContent {...other}>
      <Typography>Add Users</Typography>
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
