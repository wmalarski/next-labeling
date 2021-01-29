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
import ChatIcon from "@material-ui/icons/Chat";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import LastPageIcon from "@material-ui/icons/LastPage";
import ViewListIcon from "@material-ui/icons/ViewList";
import clsx from "clsx";
import React, { useCallback, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { getFirstFrame, getLastFrame } from "../../../labeling/functions";
import useLabelingContext from "../../../labeling/hooks/useLabelingContext";
import usePreferences from "../../../labeling/hooks/usePreferencesContext";
import useToolContext from "../../../labeling/hooks/useToolContext";
import { ToolType } from "../../../labeling/types/client";
import addObjectCopyFrameUpdate from "../../../labeling/updates/addObjectCopyFrameUpdate";
import addObjectCopyUpdate from "../../../labeling/updates/addObjectCopyUpdate";
import addObjectMergeUpdate from "../../../labeling/updates/addObjectMergeUpdate";
import addObjectSplitUpdate from "../../../labeling/updates/addObjectSplitUpdate";
import addObjectUpdate from "../../../labeling/updates/addObjectUpdate";
import deleteBackwardUpdate from "../../../labeling/updates/deleteBackwardUpdate";
import deleteForwardUpdate from "../../../labeling/updates/deleteForwardUpdate";
import deleteObjectsUpdate from "../../../labeling/updates/deleteObjectsUpdate";
import setCurrentFrameUpdate from "../../../labeling/updates/setCurrentFrameUpdate";
import setObjectsIsDoneUpdate from "../../../labeling/updates/setObjectsIsDoneUpdate";
import setSelectedAllUpdate from "../../../labeling/updates/setSelectedAllUpdate";
import setSelectedNextUpdate from "../../../labeling/updates/setSelectedNextUpdate";
import setSelectedUpdate from "../../../labeling/updates/setSelectedUpdate";
import {
  filterIcons,
  isViewVisible,
  LabelingView,
  toggleView,
} from "../../../labeling/views";
import EditorSettingsDialog from "../preferences/editorSettingsDialog";

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

export default function EditorSidebar(): JSX.Element {
  const classes = useStyles();

  const { history, document } = useLabelingContext();
  const { pushLabeling } = history;
  const { selected, currentFrame } = history.data;
  const { setTool } = useToolContext();
  const { preferences, setPreferences } = usePreferences();
  const { shortcuts, frameChangeStep: frameStep, views } = preferences;

  const selectedObjects = selected.filter(
    object => !object.singleton && object.objectSelected,
  );
  const selectedObjectsIds = selectedObjects.map(object => object.objectId);
  const isSelected = selectedObjects.length !== 0;
  const [open, setOpen] = useState(true);

  const setObjectDone = useCallback(
    () => pushLabeling(data => setObjectsIsDoneUpdate(data)),
    [pushLabeling],
  );

  const copyFrames = useCallback(
    () => pushLabeling(data => addObjectCopyFrameUpdate(data)),
    [pushLabeling],
  );

  const deleteObjects = useCallback(
    () => pushLabeling(data => deleteObjectsUpdate(data)),
    [pushLabeling],
  );

  const deleteForward = useCallback(
    () => pushLabeling(data => deleteForwardUpdate(data)),
    [pushLabeling],
  );

  const deleteBackward = useCallback(
    () => pushLabeling(data => deleteBackwardUpdate(data)),
    [pushLabeling],
  );

  const splitObjects = useCallback(
    () => pushLabeling(data => addObjectSplitUpdate(data)),
    [pushLabeling],
  );

  const mergeObjects = useCallback(
    () => pushLabeling(data => addObjectMergeUpdate(data)),
    [pushLabeling],
  );

  const selectAll = useCallback(
    () => pushLabeling(data => setSelectedAllUpdate(data)),
    [pushLabeling],
  );

  const deselect = useCallback(
    () => pushLabeling(data => setSelectedUpdate(data, [])),
    [pushLabeling],
  );

  const selectPrevious = useCallback(
    () => pushLabeling(data => setSelectedNextUpdate(data, -1)),
    [pushLabeling],
  );

  const selectNext = useCallback(
    () => pushLabeling(data => setSelectedNextUpdate(data, 1)),
    [pushLabeling],
  );

  useHotkeys(shortcuts.SetObjectDone, setObjectDone, [setObjectDone]);
  useHotkeys(shortcuts.DeleteObject, deleteObjects, [deleteObjects]);
  useHotkeys(shortcuts.DeleteForward, deleteForward, [deleteForward]);
  useHotkeys(shortcuts.DeleteBackward, deleteBackward, [deleteBackward]);
  useHotkeys(shortcuts.SelectAll, selectAll, [selectAll]);
  useHotkeys(shortcuts.Deselect, deselect, [deselect]);
  useHotkeys(shortcuts.SelectNext, selectNext, [selectNext]);
  useHotkeys(shortcuts.SelectPrevious, selectPrevious, [selectPrevious]);

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
          <ListItem disabled={!isSelected} button onClick={copyFrames}>
            <ListItemIcon>
              <FileCopyIcon />
            </ListItemIcon>
            <ListItemText primary={"Copy frame"} />
          </ListItem>
          <ListItem disabled={!isSelected} button onClick={splitObjects}>
            <ListItemIcon>
              <HighlightOffIcon />
            </ListItemIcon>
            <ListItemText primary={"Split"} />
          </ListItem>
          <ListItem disabled={!isSelected} button onClick={mergeObjects}>
            <ListItemIcon>
              <HighlightOffIcon />
            </ListItemIcon>
            <ListItemText primary={"Merge"} />
          </ListItem>
          <ListItem disabled={!isSelected} button onClick={deleteObjects}>
            <ListItemIcon>
              <HighlightOffIcon />
            </ListItemIcon>
            <ListItemText primary={"Delete"} />
          </ListItem>
          <ListItem disabled={!isSelected} button onClick={deleteBackward}>
            <ListItemIcon>
              <ArrowBackIcon />
            </ListItemIcon>
            <ListItemText primary={"Delete Backward"} />
          </ListItem>
          <ListItem disabled={!isSelected} button onClick={deleteForward}>
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
                return setCurrentFrameUpdate(data, frame, frameStep);
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
                return setCurrentFrameUpdate(data, frame, frameStep);
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
            selected={isViewVisible(views, LabelingView.TIMELINE)}
            onClick={() =>
              setPreferences({
                ...preferences,
                views: toggleView(views, LabelingView.TIMELINE),
              })
            }
          >
            <ListItemIcon>
              <AccountTreeIcon />
            </ListItemIcon>
            <ListItemText primary={"Timeline"} />
          </ListItem>
          <ListItem
            button
            selected={isViewVisible(views, LabelingView.PROPERTIES)}
            onClick={() =>
              setPreferences({
                ...preferences,
                views: toggleView(views, LabelingView.PROPERTIES),
              })
            }
          >
            <ListItemIcon>
              <ViewListIcon />
            </ListItemIcon>
            <ListItemText primary={"Properties"} />
          </ListItem>
          <ListItem
            button
            selected={isViewVisible(views, LabelingView.COMMENTS)}
            onClick={() =>
              setPreferences({
                ...preferences,
                views: toggleView(views, LabelingView.COMMENTS),
              })
            }
          >
            <ListItemIcon>
              <ChatIcon />
            </ListItemIcon>
            <ListItemText primary={"Comments"} />
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
