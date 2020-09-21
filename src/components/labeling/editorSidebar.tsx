import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import LastPageIcon from "@material-ui/icons/LastPage";
import SettingsIcon from "@material-ui/icons/Settings";
import ViewListIcon from "@material-ui/icons/ViewList";
import clsx from "clsx";
import React, { useContext, useState } from "react";

import FramesContext from "../../contexts/frames/framesContext";
import LabelingContext from "../../contexts/labeling/labelingContext";
import SelectionContext from "../../contexts/selection/selectionContext";
import { getFirstFrame, getLastFrame } from "../../utils/labeling/functions";
import {
  addObjectUpdate,
  copyObjectsUpdate,
  deleteBackwardUpdate,
  deleteForwardUpdate,
  removeObjectsUpdate,
} from "../../utils/labeling/updates";
import { filterIcons, LabelingViewsState } from "../../utils/labeling/views";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap",
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: "hidden",
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: theme.mixins.toolbar,
    lists: {
      display: "flex",
      flexDirection: "column",
    },
    spacer: {
      flexGrow: 1,
    },
  }),
);

export interface EditorSidebarProps {
  viewsState: LabelingViewsState;
  setViewsState: (state: LabelingViewsState) => void;
}

export default function EditorSidebar(props: EditorSidebarProps): JSX.Element {
  const { viewsState, setViewsState } = props;
  const classes = useStyles();

  const { history, document } = useContext(LabelingContext);
  const { currentFrame, moveTo: moveToFrame } = useContext(FramesContext);
  const { selected } = useContext(SelectionContext);

  const selectedObjects = selected.filter(
    object => !object.singleton && object.objectSelected,
  );
  const selectedObjectsIds = selectedObjects.map(object => object.objectId);
  const isSelected = selectedObjects.length !== 0;
  const [open, setOpen] = useState(true);

  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
    >
      <div className={classes.toolbar} />
      <div className={classes.lists}>
        <List>
          {document.schema.objects
            .filter(object => !object.singleton)
            .map((object, index) => {
              const ToolIcon = filterIcons[index % filterIcons.length];
              return (
                <ListItem
                  key={object.id}
                  button
                  onClick={() =>
                    history.setLabeling(doc => ({
                      message: `New ${object.name} added`,
                      data: addObjectUpdate(doc, object, currentFrame),
                    }))
                  }
                >
                  <ListItemIcon>
                    <ToolIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={object.name}
                    secondary={`Add new ${object.name}`}
                  />
                </ListItem>
              );
            })}
          <Divider />
          <ListItem
            disabled={!isSelected}
            button
            onClick={() =>
              history.setLabeling(data => ({
                message: "Objects copied",
                data: copyObjectsUpdate(data, selectedObjectsIds),
              }))
            }
          >
            <ListItemIcon>
              <FileCopyIcon />
            </ListItemIcon>
            <ListItemText primary={"Copy"} />
          </ListItem>
          <ListItem
            disabled={!isSelected}
            button
            onClick={() =>
              history.setLabeling(data => ({
                message: "Objects removed",
                data: removeObjectsUpdate(data, selectedObjectsIds),
              }))
            }
          >
            <ListItemIcon>
              <HighlightOffIcon />
            </ListItemIcon>
            <ListItemText primary={"Delete"} />
          </ListItem>
          <ListItem
            disabled={!isSelected}
            button
            onClick={() =>
              history.setLabeling(data => ({
                message: "Objects removed backward",
                data: deleteBackwardUpdate(
                  data,
                  selectedObjectsIds,
                  currentFrame,
                ),
              }))
            }
          >
            <ListItemIcon>
              <ArrowBackIcon />
            </ListItemIcon>
            <ListItemText primary={"Delete Backward"} />
          </ListItem>
          <ListItem
            disabled={!isSelected}
            button
            onClick={() =>
              history.setLabeling(data => ({
                message: "Objects removed forward",
                data: deleteForwardUpdate(
                  data,
                  selectedObjectsIds,
                  currentFrame,
                ),
              }))
            }
          >
            <ListItemIcon>
              <ArrowForwardIcon />
            </ListItemIcon>
            <ListItemText primary={"Delete Forward"} />
          </ListItem>
          <Divider />
          <ListItem
            disabled={!isSelected}
            button
            onClick={() => {
              const firstFrame = getFirstFrame(
                history.data,
                selectedObjectsIds,
              );
              if (!firstFrame) return;
              moveToFrame(firstFrame);
            }}
          >
            <ListItemIcon>
              <FirstPageIcon />
            </ListItemIcon>
            <ListItemText primary={"First Frame"} />
          </ListItem>
          <ListItem
            disabled={!isSelected}
            button
            onClick={() => {
              const lastFrame = getLastFrame(history.data, selectedObjectsIds);
              if (!lastFrame) return;
              moveToFrame(lastFrame);
            }}
          >
            <ListItemIcon>
              <LastPageIcon />
            </ListItemIcon>
            <ListItemText primary={"Last Frame"} />
          </ListItem>
        </List>
        <div className={classes.spacer} />
        <List>
          <ListItem
            button
            selected={viewsState.timeline}
            onClick={() =>
              setViewsState({ ...viewsState, timeline: !viewsState.timeline })
            }
          >
            <ListItemIcon>
              <AccountTreeIcon />
            </ListItemIcon>
            <ListItemText primary={"Timeline"} />
          </ListItem>
          <ListItem
            button
            selected={viewsState.properties}
            onClick={() =>
              setViewsState({
                ...viewsState,
                properties: !viewsState.properties,
              })
            }
          >
            <ListItemIcon>
              <ViewListIcon />
            </ListItemIcon>
            <ListItemText primary={"Properties"} />
          </ListItem>
          <ListItem button onClick={() => void 0}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary={"Settings"} />
          </ListItem>
          <Divider />
          <ListItem button onClick={() => setOpen(!open)}>
            <ListItemIcon>
              {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </ListItemIcon>
            <ListItemText primary={"Hide"} />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
}
