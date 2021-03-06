import { createSlice, nanoid } from "@reduxjs/toolkit";
import setAttributeAction from "../../editors/redux/actions/setAttributeAction";
import setDrawingToolAction from "../../editors/redux/actions/setDrawingToolAction";
import setToolTypeAction from "../../editors/redux/actions/setToolTypeAction";
import setPreferencesAction from "../../preferences/redux/actions/setPreferencesAction";
import setShortcutAction from "../../preferences/redux/actions/setShortcutAction";
import toggleWorkspaceViewAction from "../../preferences/redux/actions/toggleWorkspaceViewAction";
import updateWorkspaceViewAction from "../../preferences/redux/actions/updateWorkspaceViewAction";
import addObjectCopyAction from "../../toolbars/redux/actions/addObjectCopyAction";
import addObjectCopyFrameAction from "../../toolbars/redux/actions/addObjectCopyFrameAction";
import addObjectMergeAction from "../../toolbars/redux/actions/addObjectMergeAction";
import addObjectSplitAction from "../../toolbars/redux/actions/addObjectSplitAction";
import redoLabelingAction from "../../toolbars/redux/actions/redoLabelingAction";
import setObjectFirstFrameAction from "../../toolbars/redux/actions/setObjectFirstFrameAction";
import setObjectLastFrameAction from "../../toolbars/redux/actions/setObjectLastFrameAction";
import setSnapshotAction from "../../toolbars/redux/actions/setSnapshotAction";
import setSnapshotIdAction from "../../toolbars/redux/actions/setSnapshotIdAction";
import undoLabelingAction from "../../toolbars/redux/actions/undoLabelingAction";
import { defaultShortcutActions } from "../shortcuts";
import { IsDoneFilterValue, ToolType } from "../types/client";
import { defaultLabelingViews } from "../views";
import addObjectAction from "./actions/addObjectAction";
import addSelectedObjectAction from "./actions/addSelectedObjectAction";
import deleteBackwardAction from "./actions/deleteBackwardAction";
import deleteForwardAction from "./actions/deleteForwardAction";
import deleteObjectsAction from "./actions/deleteObjectsAction";
import deselectObjectAction from "./actions/deselectObjectAction";
import moveCurrentFrameAction from "./actions/moveCurrentFrameAction";
import resetLabelingAction from "./actions/resetLabelingAction";
import selectObjectAction from "./actions/selectObjectAction";
import setCurrentFrameAction from "./actions/setCurrentFrameAction";
import setDurationAction from "./actions/setDurationAction";
import setFiltersAction from "./actions/setFiltersAction";
import setIsDoneAction from "./actions/setIsDoneAction";
import setIsTrackedAction from "./actions/setIsTrackedAction";
import setNameAction from "./actions/setNameAction";
import setObjectsIsDoneAction from "./actions/setObjectsIsDoneAction";
import setSelectedAction from "./actions/setSelectedAction";
import setSelectedAllAction from "./actions/setSelectedAllAction";
import setSelectedNextAction from "./actions/setSelectedNextAction";
import setSelectedObjectAction from "./actions/setSelectedObjectAction";
import setToggledAction from "./actions/setToggledAction";
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
      id: nanoid(),
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

export const workspaceReducer = createSlice({
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
