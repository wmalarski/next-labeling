import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import Typography from "@material-ui/core/Typography";
import React, { useCallback } from "react";
import { AuthUser } from "../../../auth/user";
import { defaultProjectDocument } from "../../constants";
import useProjectHistory, { ProjectStep } from "../../hooks/useProjectHistory";
import { useProjectStepsStyles } from "../../styles";
import { ProjectDocument } from "../../types";
import ProjectGeneralStep from "./projectGeneralStep";
import ProjectSchemasStep from "./projectSchemasStep";
import ProjectUsersStep from "./projectUsersStep";
import ProjectWorkflowStep from "./projectWorkflowStep";

export interface ProjectFormProps {
  authUser: AuthUser;
  onSubmit: (project: ProjectDocument) => void;
}

export default function ProjectSteps(props: ProjectFormProps): JSX.Element {
  const classes = useProjectStepsStyles();

  const { authUser, onSubmit } = props;
  const stepsCount = ProjectStep.SCHEMAS + 1;

  const { project, step, push } = useProjectHistory(
    {
      ...defaultProjectDocument,
      author: authUser,
      contributors: [
        { roles: defaultProjectDocument.workflow.roles, user: authUser.id },
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
        <Step>
          <StepLabel>Workflow</StepLabel>
          <ProjectWorkflowStep
            project={project}
            push={push}
            onPreviousClicked={handleBack}
            onNextClicked={handleNext}
            onSkipClicked={handleSkip}
          />
        </Step>
        <Step>
          <StepLabel>Users</StepLabel>
          <ProjectUsersStep
            project={project}
            push={push}
            onPreviousClicked={handleBack}
            onNextClicked={handleNext}
            onSkipClicked={handleSkip}
          />
        </Step>
        <Step>
          <StepLabel>Schemas</StepLabel>
          <ProjectSchemasStep
            project={project}
            push={push}
            onPreviousClicked={handleBack}
            onNextClicked={handleNext}
            onSkipClicked={handleSkip}
          />
        </Step>
      </Stepper>
      {step === stepsCount && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleBack} className={classes.button}>
            Back
          </Button>
          <Button onClick={() => onSubmit(project)} className={classes.button}>
            Save
          </Button>
        </Paper>
      )}
    </div>
  );
}
