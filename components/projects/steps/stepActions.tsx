import Button from "@material-ui/core/Button";
import React from "react";

export interface StepActionsProps {
  previousVisible: boolean;
  nextDisabled: boolean;
  onPreviousClicked: () => void;
  onNextClicked: () => void;
  onSkipClicked: () => void;
}

export default function StepActions(props: StepActionsProps): JSX.Element {
  const {
    previousVisible,
    nextDisabled,
    onPreviousClicked,
    onNextClicked,
    onSkipClicked,
  } = props;

  return (
    <div>
      {previousVisible && (
        <Button variant="contained" color="primary" onClick={onPreviousClicked}>
          Previous
        </Button>
      )}
      <Button
        variant="contained"
        color="primary"
        disabled={nextDisabled}
        onClick={onNextClicked}
      >
        Next
      </Button>
      <Button
        variant="contained"
        color="primary"
        disabled={nextDisabled}
        onClick={onSkipClicked}
      >
        Skip
      </Button>
    </div>
  );
}
