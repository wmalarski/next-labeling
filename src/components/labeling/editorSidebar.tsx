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
import ViewListIcon from "@material-ui/icons/ViewList";
import clsx from "clsx";
import React, { useState } from "react";

import { getFirstFrame, getLastFrame } from "../../utils/labeling/functions";
import useLabelingContext from "../../utils/labeling/hooks/useLabelingContext";
import usePreferences from "../../utils/labeling/hooks/usePreferencesContext";
import addObjectCopyUpdate from "../../utils/labeling/updates/addObjectCopyUpdate";
import addObjectUpdate from "../../utils/labeling/updates/addObjectUpdate";
import deleteBackwardUpdate from "../../utils/labeling/updates/deleteBackwardUpdate";
import deleteForwardUpdate from "../../utils/labeling/updates/deleteForwardUpdate";
import deleteObjectsUpdate from "../../utils/labeling/updates/deleteObjectsUpdate";
import setCurrentFrameUpdate from "../../utils/labeling/updates/setCurrentFrameUpdate";
import { filterIcons, LabelingViewsState } from "../../utils/labeling/views";
import useToolContext from "../../utils/visualization/hooks/useToolContext";
import { ToolType } from "../../utils/visualization/types";
import EditorSettingsDialog from "./editorSettingsDialog";

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

  const { history, document } = useLabelingContext();
  const { pushLabeling } = history;
  const { selected, currentFrame } = history.data;
  const { setTool } = useToolContext();
  const { preferences } = usePreferences();

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
                    pushLabeling(doc => {
                      const [newObjectId, state] = addObjectUpdate(
                        doc,
                        object,
                        currentFrame,
                      );
                      setTool({
                        toolType: ToolType.DRAWING_TOOL,
                        objectId: newObjectId,
                      });
                      return state;
                    })
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
              pushLabeling(data =>
                addObjectCopyUpdate(data, selectedObjectsIds),
              )
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
              pushLabeling(data =>
                deleteObjectsUpdate(data, selectedObjectsIds),
              )
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
              pushLabeling(data =>
                deleteBackwardUpdate(data, selectedObjectsIds, currentFrame),
              )
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
              pushLabeling(data =>
                deleteForwardUpdate(data, selectedObjectsIds, currentFrame),
              )
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
            onClick={() =>
              pushLabeling(data => {
                const frame = getFirstFrame(history.data, selectedObjectsIds);
                if (!frame) return;
                return setCurrentFrameUpdate(
                  data,
                  frame,
                  preferences.frameChangeStep,
                );
              })
            }
          >
            <ListItemIcon>
              <FirstPageIcon />
            </ListItemIcon>
            <ListItemText primary={"First Frame"} />
          </ListItem>
          <ListItem
            disabled={!isSelected}
            button
            onClick={() =>
              pushLabeling(data => {
                const frame = getLastFrame(history.data, selectedObjectsIds);
                if (!frame) return;
                return setCurrentFrameUpdate(
                  data,
                  frame,
                  preferences.frameChangeStep,
                );
              })
            }
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
          <EditorSettingsDialog />
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
