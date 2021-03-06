import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import LastPageIcon from "@material-ui/icons/LastPage";
import compact from "lodash/compact";
import React, { useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useSelector } from "react-redux";
import { useRootDispatch } from "../../common/redux/store";
import { shortcutsSelector } from "../../preferences/redux/selectors";
import {
  currentFrameSelector,
  objectsSelector,
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
  setObjectFirstFrame,
  setObjectLastFrame,
  setObjectsIsDone,
  setSelected,
  setSelectedAll,
  setSelectedNext,
} from "../../workspace/redux/slice";

function EditorItemsSidebar(): JSX.Element {
  const dispatch = useRootDispatch();
  const selected = useSelector(selectedObjectSelector);
  const shortcuts = useSelector(shortcutsSelector);
  const objects = useSelector(objectsSelector);
  const currentFrame = useSelector(currentFrameSelector);

  const selectedObjects = compact(
    selected
      .filter(object => !object.singleton && object.objectSelected)
      .map(selection => objects.find(obj => obj.id === selection.objectId)),
  );

  const isSelected = selectedObjects.length !== 0;

  const handleSetObjectDone = useCallback(
    (): void => void dispatch(setObjectsIsDone()),
    [dispatch],
  );

  const handleCopyFrames = useCallback(
    (): void =>
      void dispatch(
        addObjectCopyFrame({ currentFrame, objects: selectedObjects }),
      ),
    [dispatch, currentFrame, selectedObjects],
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
    (): void =>
      void dispatch(addObjectSplit({ currentFrame, objects: selectedObjects })),
    [dispatch, currentFrame, selectedObjects],
  );

  const handleMergeObjects = useCallback(
    (): void =>
      void dispatch(
        addObjectMerge({ currentFrame, objectsToMerge: selectedObjects }),
      ),
    [dispatch, currentFrame, selectedObjects],
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
    <List>
      <ListItem
        disabled={!isSelected}
        button
        onClick={(): void => void dispatch(addObjectCopy(selectedObjects))}
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
      <ListItem disabled={!isSelected} button onClick={handleDeleteBackward}>
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
  );
}

export default React.memo(EditorItemsSidebar);
