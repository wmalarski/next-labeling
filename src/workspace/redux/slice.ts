import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { defaultShortcutActions } from "../shortcuts";
import { IsDoneFilterValue, ToolType } from "../types/client";
import { defaultLabelingViews } from "../views";
import addObjectAction from "./actions/addObjectAction";
import addObjectCopyAction from "./actions/addObjectCopyAction";
import addObjectCopyFrameAction from "./actions/addObjectCopyFrameAction";
import addObjectMergeAction from "./actions/addObjectMergeAction";
import addObjectSplitAction from "./actions/addObjectSplitAction";
import addSelectedObjectAction from "./actions/addSelectedObjectAction";
import deleteBackwardAction from "./actions/deleteBackwardAction";
import deleteForwardAction from "./actions/deleteForwardAction";
import deleteObjectsAction from "./actions/deleteObjectsAction";
import deselectObjectAction from "./actions/deselectObjectAction";
import moveCurrentFrameAction from "./actions/moveCurrentFrameAction";
import redoLabelingAction from "./actions/redoLabelingAction";
import resetLabelingAction from "./actions/resetLabelingAction";
import selectObjectAction from "./actions/selectObjectAction";
import setAttributeAction from "./actions/setAttributeAction";
import setCurrentFrameAction from "./actions/setCurrentFrameAction";
import setDrawingToolAction from "./actions/setDrawingToolAction";
import setDurationAction from "./actions/setDurationAction";
import setFiltersAction from "./actions/setFiltersAction";
import setIsDoneAction from "./actions/setIsDoneAction";
import setIsTrackedAction from "./actions/setIsTrackedAction";
import setNameAction from "./actions/setNameAction";
import setObjectFirstFrameAction from "./actions/setObjectFirstFrameAction";
import setObjectLastFrameAction from "./actions/setObjectLastFrameAction";
import setObjectsIsDoneAction from "./actions/setObjectsIsDoneAction";
import setPreferencesAction from "./actions/setPreferencesAction";
import setSelectedAction from "./actions/setSelectedAction";
import setSelectedAllAction from "./actions/setSelectedAllAction";
import setSelectedNextAction from "./actions/setSelectedNextAction";
import setSelectedObjectAction from "./actions/setSelectedObjectAction";
import setShortcutAction from "./actions/setShortcutAction";
import setSnapshotAction from "./actions/setSnapshotAction";
import setSnapshotIdAction from "./actions/setSnapshotIdAction";
import setToggledAction from "./actions/setToggledAction";
import setToolTypeAction from "./actions/setToolTypeAction";
import toggleWorkspaceViewAction from "./actions/toggleWorkspaceViewAction";
import undoLabelingAction from "./actions/undoLabelingAction";
import updateWorkspaceViewAction from "./actions/updateWorkspaceViewAction";
import { LabelingDirection, WorkspaceState } from "./state";

const initialState: WorkspaceState = {
  index: 0,
  duration: 1,
  filters: {
    isDone: IsDoneFilterValue.ALL,
    objectSchemaIds: [],
  },
  drawingTool: null,
  toolType: ToolType.ZOOM_AND_PANE,
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
  initial: {
    project: null,
    createdAt: null,
    objects: [],
    filename: "",
    fps: 24,
    name: "",
    schemaId: "",
    schema: {
      description: "",
      name: "",
      objects: [],
      version: "",
    },
    user: {
      displayName: "",
      email: "",
      emailVerified: false,
      id: "",
    },
  },
  preferences: {
    labelingDirection: LabelingDirection.FORWARD,
    frameChangeStep: 1,
    shortcuts: defaultShortcutActions,
    autoSaveDelayMinutes: 1,
    views: defaultLabelingViews,
  },
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
    deselectObjectAction,
    moveCurrentFrameAction,
    redoLabelingAction,
    resetLabelingAction,
    selectObjectAction,
    setAttributeAction,
    setCurrentFrameAction,
    setDrawingToolAction,
    setDurationAction,
    setFiltersAction,
    setIsDoneAction,
    setIsTrackedAction,
    setNameAction,
    setObjectFirstFrameAction,
    setObjectLastFrameAction,
    setObjectsIsDoneAction,
    setPreferencesAction,
    setSelectedAction,
    setSelectedAllAction,
    setSelectedNextAction,
    setSelectedObjectAction,
    setShortcutAction,
    setSnapshotAction,
    setSnapshotIdAction,
    setToggledAction,
    setToolTypeAction,
    toggleWorkspaceViewAction,
    undoLabelingAction,
    updateWorkspaceViewAction,
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
  deselectObjectAction: deselectObject,
  moveCurrentFrameAction: moveCurrentFrame,
  redoLabelingAction: redoLabeling,
  resetLabelingAction: resetLabeling,
  selectObjectAction: selectObject,
  setAttributeAction: setAttribute,
  setCurrentFrameAction: setCurrentFrame,
  setDrawingToolAction: setDrawingTool,
  setDurationAction: setDuration,
  setFiltersAction: setFilters,
  setIsDoneAction: setIsDone,
  setIsTrackedAction: setIsTracked,
  setNameAction: setName,
  setObjectFirstFrameAction: setObjectFirstFrame,
  setObjectLastFrameAction: setObjectLastFrame,
  setObjectsIsDoneAction: setObjectsIsDone,
  setPreferencesAction: setPreferences,
  setSelectedAction: setSelected,
  setSelectedAllAction: setSelectedAll,
  setSelectedNextAction: setSelectedNext,
  setSelectedObjectAction: setSelectedObject,
  setShortcutAction: setShortcut,
  setSnapshotAction: setSnapshot,
  setSnapshotIdAction: setSnapshotId,
  setToggledAction: setToggled,
  setToolTypeAction: setToolType,
  toggleWorkspaceViewAction: toggleWorkspaceView,
  undoLabelingAction: undoLabeling,
  updateWorkspaceViewAction: updateWorkspaceView,
} = workspaceReducer.actions;

export default workspaceReducer.reducer;
