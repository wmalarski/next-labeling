import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useCallback } from "react";

import { AuthUser } from "../../../utils/auth/user";
import { defaultProjectDocument } from "../../../utils/projects/constans";
import useProjectHistory, {
  ProjectStep,
} from "../../../utils/projects/hooks/useProjectHistory";
import { ProjectDocument } from "../../../utils/projects/types";
import ProjectGeneralStep from "./projectGeneralStep";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    resetContainer: {
      padding: theme.spacing(3),
    },
  }),
);

export interface ProjectFormProps {
  authUser: AuthUser;
  onSubmit: (project: ProjectDocument) => void;
}

export default function ProjectSteps(props: ProjectFormProps): JSX.Element {
  const classes = useStyles();

  const { authUser, onSubmit } = props;
  const stepsCount = Object.keys(ProjectStep).length;

  const { project, step, push } = useProjectHistory(
    {
      ...defaultProjectDocument,
      author: authUser,
      contributors: [
        { roles: defaultProjectDocument.roles, user: authUser.id },
      ],
    },
    ProjectStep.GENERAL,
    10,
  );

  const handleBack = useCallback(
    () => push(state => ({ ...state, step: state.step - 1 })),
    [push],
  );
  const handleNext = useCallback(
    () => push(state => ({ ...state, step: state.step + 1 })),
    [push],
  );
  const handleSkip = useCallback(
    () => push(state => ({ ...state, step: stepsCount })),
    [push, stepsCount],
  );

  return (
    <div className={classes.root}>
      <Stepper activeStep={step} orientation="vertical">
        <Step>
          <StepLabel>General Settings</StepLabel>
          <ProjectGeneralStep
            project={project}
            push={push}
            onNextClicked={handleNext}
            onSkipClicked={handleSkip}
          />
        </Step>
      </Stepper>
      {step === stepsCount && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={() => onSubmit(project)} className={classes.button}>
            Reset
          </Button>
        </Paper>
      )}
    </div>
  );
}
