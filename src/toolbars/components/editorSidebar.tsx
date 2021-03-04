import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
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
import { useSelector } from "react-redux";
import { useRootDispatch } from "../../common/redux/store";
import getCoordsBuilders from "../../editors/builders/getCoordsBuilder";
import EditorSettingsDialog from "../../preferences/components/editorSettingsDialog";
import {
  labelingViewsSelector,
  shortcutsSelector,
} from "../../preferences/redux/selectors";
import {
  schemaSelector,
  selectedObjectSelector,
} from "../../workspace/redux/selectors";
import {
  addObjectCopy,
  addObjectCopyFrame,
  addObjectMerge,
  addObjectSplit,
  deleteBackward,
  deleteForward,
  deleteObjects,
  setDrawingTool,
  setObjectFirstFrame,
  setObjectLastFrame,
  setObjectsIsDone,
  setSelected,
  setSelectedAll,
  setSelectedNext,
  toggleWorkspaceView,
} from "../../workspace/redux/slice";
import { useEditorSidebarStyles } from "../../workspace/styles";
import {
  filterIcons,
  isViewVisible,
  LabelingView,
} from "../../workspace/views";

export default function EditorSidebar(): JSX.Element {
  const classes = useEditorSidebarStyles();

  const dispatch = useRootDispatch();
  const schema = useSelector(schemaSelector);
  const selected = useSelector(selectedObjectSelector);
  const views = useSelector(labelingViewsSelector);
  const shortcuts = useSelector(shortcutsSelector);

  const selectedObjects = selected.filter(
    object => !object.singleton && object.objectSelected,
  );
  const selectedObjectsIds = selectedObjects.map(object => object.objectId);
  const isSelected = selectedObjects.length !== 0;
  const [open, setOpen] = useState(true);

  const handleSetObjectDone = useCallback(
    (): void => void dispatch(setObjectsIsDone()),
    [dispatch],
  );

  const handleCopyFrames = useCallback(
    (): void => void dispatch(addObjectCopyFrame()),
    [dispatch],
  );

  const handleDeleteObjects = useCallback(
    (): void => void dispatch(deleteObjects()),
    [dispatch],
  );

  const handleDeleteForward = useCallback(
    (): void => void dispatch(deleteForward()),
    [dispatch],
  );

  const handleDeleteBackward = useCallback(
    (): void => void dispatch(deleteBackward()),
    [dispatch],
  );

  const handleSplitObjects = useCallback(
    (): void => void dispatch(addObjectSplit()),
    [dispatch],
  );

  const handleMergeObjects = useCallback(
    (): void => void dispatch(addObjectMerge()),
    [dispatch],
  );

  const handleSelectAll = useCallback(
    (): void => void dispatch(setSelectedAll()),
    [dispatch],
  );

  const handleDeselect = useCallback(
    (): void => void dispatch(setSelected([])),
    [dispatch],
  );

  const handleSelectPrevious = useCallback(
    (): void => void dispatch(setSelectedNext(-1)),
    [dispatch],
  );

  const handleSelectNext = useCallback(
    (): void => void dispatch(setSelectedNext(1)),
    [dispatch],
  );

  useHotkeys(shortcuts.SetObjectDone, handleSetObjectDone, [
    handleSetObjectDone,
  ]);
  useHotkeys(shortcuts.DeleteObject, handleDeleteObjects, [deleteObjects]);
  useHotkeys(shortcuts.DeleteForward, handleDeleteForward, [
    handleDeleteForward,
  ]);
  useHotkeys(shortcuts.DeleteBackward, handleDeleteBackward, [
    handleDeleteBackward,
  ]);
  useHotkeys(shortcuts.SelectAll, handleSelectAll, [handleSelectAll]);
  useHotkeys(shortcuts.Deselect, handleDeselect, [handleDeselect]);
  useHotkeys(shortcuts.SelectNext, handleSelectNext, [handleSelectNext]);
  useHotkeys(shortcuts.SelectPrevious, handleSelectPrevious, [
    handleSelectPrevious,
  ]);

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
          {schema.objects
            .filter(objectSchema => !objectSchema.singleton)
            .map((objectSchema, index) => {
              const ToolIcon = filterIcons[index % filterIcons.length];
              const fieldSchema = objectSchema.fields.find(
                field =>
                  !!getCoordsBuilders({
                    fieldSchema: field,
                    objectSchema,
                  }),
              );
              return (
                fieldSchema && (
                  <ListItem
                    key={objectSchema.id}
                    button
                    onClick={() =>
                      dispatch(setDrawingTool({ fieldSchema, objectSchema }))
                    }
                  >
                    <ListItemIcon>
                      <ToolIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={objectSchema.name}
                      secondary={`Add new ${objectSchema.name}`}
                    />
                  </ListItem>
                )
              );
            })}
          <Divider />
          <ListItem
            disabled={!isSelected}
            button
            onClick={(): void =>
              void dispatch(addObjectCopy(selectedObjectsIds))
            }
          >
            <ListItemIcon>
              <FileCopyIcon />
            </ListItemIcon>
            <ListItemText primary={"Copy"} />
          </ListItem>
          <ListItem disabled={!isSelected} button onClick={handleCopyFrames}>
            <ListItemIcon>
              <FileCopyIcon />
            </ListItemIcon>
            <ListItemText primary={"Copy frame"} />
          </ListItem>
          <ListItem disabled={!isSelected} button onClick={handleSplitObjects}>
            <ListItemIcon>
              <HighlightOffIcon />
            </ListItemIcon>
            <ListItemText primary={"Split"} />
          </ListItem>
          <ListItem disabled={!isSelected} button onClick={handleMergeObjects}>
            <ListItemIcon>
              <HighlightOffIcon />
            </ListItemIcon>
            <ListItemText primary={"Merge"} />
          </ListItem>
          <ListItem disabled={!isSelected} button onClick={handleDeleteObjects}>
            <ListItemIcon>
              <HighlightOffIcon />
            </ListItemIcon>
            <ListItemText primary={"Delete"} />
          </ListItem>
          <ListItem
            disabled={!isSelected}
            button
            onClick={handleDeleteBackward}
          >
            <ListItemIcon>
              <ArrowBackIcon />
            </ListItemIcon>
            <ListItemText primary={"Delete Backward"} />
          </ListItem>
          <ListItem disabled={!isSelected} button onClick={handleDeleteForward}>
            <ListItemIcon>
              <ArrowForwardIcon />
            </ListItemIcon>
            <ListItemText primary={"Delete Forward"} />
          </ListItem>
          <Divider />
          <ListItem
            disabled={!isSelected}
            button
            onClick={(): void => void dispatch(setObjectFirstFrame())}
          >
            <ListItemIcon>
              <FirstPageIcon />
            </ListItemIcon>
            <ListItemText primary={"First Frame"} />
          </ListItem>
          <ListItem
            disabled={!isSelected}
            button
            onClick={(): void => void dispatch(setObjectLastFrame())}
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
            onClick={() => dispatch(toggleWorkspaceView(LabelingView.TIMELINE))}
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
              dispatch(toggleWorkspaceView(LabelingView.PROPERTIES))
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
            onClick={() => dispatch(toggleWorkspaceView(LabelingView.COMMENTS))}
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
