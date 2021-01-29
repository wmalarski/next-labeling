import { makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import React from "react";
import GridLayout from "react-grid-layout";
import usePreferences from "../../labeling/hooks/usePreferencesContext";
import { toggleView, updateView } from "../../labeling/views";
import "../../node_modules/react-grid-layout/css/styles.css";
import "../../node_modules/react-resizable/css/styles.css";

const useStyles = makeStyles(() => ({
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  question: {
    overflow: "auto",
    maxHeight: "100%",
  },
}));

export interface LabelingViewCardProps {
  view: GridLayout.Layout;
  title?: string;
  subheader?: string;
  isClosable?: boolean;
  children: JSX.Element | JSX.Element[] | null;
  actions?: JSX.Element | JSX.Element[] | null;
  toolbar?: JSX.Element | JSX.Element[] | null;
}

export default function LabelingViewCard(
  props: LabelingViewCardProps,
): JSX.Element | null {
  const classes = useStyles();

  const {
    view,
    title,
    isClosable,
    subheader,
    children,
    actions,
    toolbar,
  } = props;
  const { i: key, static: isStatic } = view;

  const { setViews } = usePreferences();

  return (
    <Card elevation={3} className={classes.card}>
      <CardHeader
        action={
          <>
            {actions}
            <IconButton
              aria-label="pin"
              onClick={() =>
                setViews(views => updateView(views, key, { static: !isStatic }))
              }
            >
              <DragIndicatorIcon color={isStatic ? "disabled" : "primary"} />
            </IconButton>
            {isClosable && (
              <IconButton
                aria-label="close"
                onClick={() => setViews(views => toggleView(views, key))}
              >
                <CloseIcon />
              </IconButton>
            )}
          </>
        }
        title={title}
        subheader={subheader}
      />
      <div>{toolbar}</div>
      <div className={classes.question}>
        <CardContent>{children}</CardContent>
      </div>
    </Card>
  );
}
