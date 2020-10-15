import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useCallback, useState } from "react";

import { AuthUser } from "../../../utils/auth/user";
import { defaultProjectDocument } from "../../../utils/projects/constans";
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

enum ProjectStep {
  GENERAL = 0,
  WORKFLOWS = 1,
  USERS = 2,
  SCHEMAS = 3,
}

export default function ProjectSteps(props: ProjectFormProps): JSX.Element {
  const classes = useStyles();

  const { authUser, onSubmit } = props;
  const stepsCount = Object.keys(ProjectStep).length;

  const [activeStep, setActiveStep] = useState(ProjectStep.GENERAL);
  const [document, setDocument] = useState<ProjectDocument>({
    ...defaultProjectDocument,
    author: authUser,
    contributors: [{ roles: defaultProjectDocument.roles, user: authUser.id }],
  });

  const pushProject = useCallback(
    (provider: (doc: ProjectDocument) => ProjectDocument): void =>
      setDocument(provider),
    [],
  );

  const handleNext = () => setActiveStep(prevActiveStep => prevActiveStep + 1);

  const handleBack = () => setActiveStep(prevActiveStep => prevActiveStep - 1);

  const handleSkip = () => setActiveStep(stepsCount);

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step>
          <StepLabel>General Settings</StepLabel>
          <ProjectGeneralStep
            document={document}
            pushProject={pushProject}
            onNextClicked={handleNext}
            onSkipClicked={handleSkip}
          />
        </Step>
      </Stepper>
      {activeStep === stepsCount && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={() => onSubmit(document)} className={classes.button}>
            Reset
          </Button>
        </Paper>
      )}
    </div>
  );
}
