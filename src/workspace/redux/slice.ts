import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import addObjectAction from "./actions/addObjectAction";
import addObjectCopyAction from "./actions/addObjectCopyAction";
import addObjectCopyFrameAction from "./actions/addObjectCopyFrameAction";
import addObjectMergeAction from "./actions/addObjectMergeAction";
import addObjectSplitAction from "./actions/addObjectSplitAction";
import addSelectedObjectAction from "./actions/addSelectedObjectAction";
import deleteBackwardAction from "./actions/deleteBackwardAction";
import deleteForwardAction from "./actions/deleteForwardAction";
import deleteObjectsAction from "./actions/deleteObjectsAction";
import setAttributeAction from "./actions/setAttributeAction";
import setCurrentFrameAction from "./actions/setCurrentFrameAction";
import setIsDoneAction from "./actions/setIsDoneAction";
import setIsTrackedAction from "./actions/setIsTrackedAction";
import setNameAction from "./actions/setNameAction";
import setObjectsIsDoneAction from "./actions/setObjectsIsDoneAction";
import setSelectedAction from "./actions/setSelectedAction";
import setSelectedAllAction from "./actions/setSelectedAllAction";
import setSelectedNextAction from "./actions/setSelectedNextAction";
import setSelectedObjectAction from "./actions/setSelectedObjectAction";
import setSnapshotAction from "./actions/setSnapshotAction";
import setToggledAction from "./actions/setToggledAction";
import { WorkspaceState } from "./state";

const initialState: WorkspaceState = {
  index: 0,
  history: [
    {
      id: uuidv4(),
      message: "",
      data: {
        objects: [],
        currentFrame: 0,
        selected: [],
        toggled: [],
      },
    },
  ],
};

const workspaceReducer = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    addObjectAction,
    addObjectCopyFrameAction,
    addObjectCopyAction,
    addObjectMergeAction,
    addObjectSplitAction,
    addSelectedObjectAction,
    deleteBackwardAction,
    deleteForwardAction,
    deleteObjectsAction,
    setAttributeAction,
    setCurrentFrameAction,
    setIsDoneAction,
    setIsTrackedAction,
    setNameAction,
    setObjectsIsDoneAction,
    setSelectedAction,
    setSelectedAllAction,
    setSelectedNextAction,
    setSelectedObjectAction,
    setSnapshotAction,
    setToggledAction,
  },
});

export const {
  addObjectAction: addObject,
  addObjectCopyFrameAction: addObjectCopyFrame,
  addObjectCopyAction: addObjectCopy,
  addObjectMergeAction: addObjectMerge,
  addObjectSplitAction: addObjectSplit,
  addSelectedObjectAction: addSelectedObject,
  deleteBackwardAction: deleteBackward,
  deleteForwardAction: deleteForward,
  deleteObjectsAction: deleteObjects,
  setAttributeAction: setAttribute,
  setCurrentFrameAction: setCurrentFrame,
  setIsDoneAction: setIsDone,
  setIsTrackedAction: setIsTracked,
  setNameAction: setName,
  setObjectsIsDoneAction: setObjectsIsDone,
  setSelectedAction: setSelected,
  setSelectedAllAction: setSelectedAll,
  setSelectedNextAction: setSelectedNext,
  setSelectedObjectAction: setSelectedObject,
  setSnapshotAction: setSnapshot,
  setToggledAction: setToggled,
} = workspaceReducer.actions;

export default workspaceReducer.reducer;
