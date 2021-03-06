import { createSlice, nanoid } from "@reduxjs/toolkit";
import setAttributeReducer from "../../editors/redux/reducers/setAttributeReducer";
import setDrawingToolReducer from "../../editors/redux/reducers/setDrawingToolReducer";
import setToolTypeReducer from "../../editors/redux/reducers/setToolTypeReducer";
import setPreferencesReducer from "../../preferences/redux/reducers/setPreferencesReducer";
import setShortcutReducer from "../../preferences/redux/reducers/setShortcutReducer";
import toggleWorkspaceViewReducer from "../../preferences/redux/reducers/toggleWorkspaceViewReducer";
import updateWorkspaceViewReducer from "../../preferences/redux/reducers/updateWorkspaceViewReducer";
import addObjectCopyFrameReducer from "../../toolbars/redux/reducers/addObjectCopyFrameReducer";
import addObjectCopyReducer from "../../toolbars/redux/reducers/addObjectCopyReducer";
import addObjectMergeReducer from "../../toolbars/redux/reducers/addObjectMergeReducer";
import addObjectSplitReducer from "../../toolbars/redux/reducers/addObjectSplitReducer";
import redoLabelingReducer from "../../toolbars/redux/reducers/redoLabelingReducer";
import setObjectFirstFrameReducer from "../../toolbars/redux/reducers/setObjectFirstFrameReducer";
import setObjectLastFrameReducer from "../../toolbars/redux/reducers/setObjectLastFrameReducer";
import setSnapshotIdReducer from "../../toolbars/redux/reducers/setSnapshotIdReducer";
import setSnapshotReducer from "../../toolbars/redux/reducers/setSnapshotReducer";
import undoLabelingReducer from "../../toolbars/redux/reducers/undoLabelingReducer";
import { defaultShortcutActions } from "../shortcuts";
import { IsDoneFilterValue, ToolType } from "../types/client";
import { defaultLabelingViews } from "../views";
import addObjectReducer from "./reducers/addObjectReducer";
import addSelectedObjectReducer from "./reducers/addSelectedObjectReducer";
import deleteBackwardReducer from "./reducers/deleteBackwardReducer";
import deleteForwardReducer from "./reducers/deleteForwardReducer";
import deleteObjectsReducer from "./reducers/deleteObjectsReducer";
import deselectObjectReducer from "./reducers/deselectObjectReducer";
import moveCurrentFrameReducer from "./reducers/moveCurrentFrameReducer";
import resetLabelingReducer from "./reducers/resetLabelingReducer";
import selectObjectReducer from "./reducers/selectObjectReducer";
import setCurrentFrameReducer from "./reducers/setCurrentFrameReducer";
import setDurationReducer from "./reducers/setDurationReducer";
import setFiltersReducer from "./reducers/setFiltersReducer";
import setIsDoneReducer from "./reducers/setIsDoneReducer";
import setIsTrackedReducer from "./reducers/setIsTrackedReducer";
import setNameReducer from "./reducers/setNameReducer";
import setObjectsIsDoneReducer from "./reducers/setObjectsIsDoneReducer";
import setSelectedAllReducer from "./reducers/setSelectedAllReducer";
import setSelectedNextReducer from "./reducers/setSelectedNextReducer";
import setSelectedObjectReducer from "./reducers/setSelectedObjectReducer";
import setSelectedReducer from "./reducers/setSelectedReducer";
import setToggledReducer from "./reducers/setToggledReducer";
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
    addObject: addObjectReducer,
    addObjectCopyFrame: addObjectCopyFrameReducer,
    addObjectCopy: addObjectCopyReducer,
    addObjectMerge: addObjectMergeReducer,
    addObjectSplit: addObjectSplitReducer,
    addSelectedObject: addSelectedObjectReducer,
    deleteBackward: deleteBackwardReducer,
    deleteForward: deleteForwardReducer,
    deleteObjects: deleteObjectsReducer,
    deselectObject: deselectObjectReducer,
    moveCurrentFrame: moveCurrentFrameReducer,
    redoLabeling: redoLabelingReducer,
    resetLabeling: resetLabelingReducer,
    selectObject: selectObjectReducer,
    setAttribute: setAttributeReducer,
    setCurrentFrame: setCurrentFrameReducer,
    setDrawingTool: setDrawingToolReducer,
    setDuration: setDurationReducer,
    setFilters: setFiltersReducer,
    setIsDone: setIsDoneReducer,
    setIsTracked: setIsTrackedReducer,
    setName: setNameReducer,
    setObjectFirstFrame: setObjectFirstFrameReducer,
    setObjectLastFrame: setObjectLastFrameReducer,
    setObjectsIsDone: setObjectsIsDoneReducer,
    setPreferences: setPreferencesReducer,
    setSelected: setSelectedReducer,
    setSelectedAll: setSelectedAllReducer,
    setSelectedNext: setSelectedNextReducer,
    setSelectedObject: setSelectedObjectReducer,
    setShortcut: setShortcutReducer,
    setSnapshot: setSnapshotReducer,
    setSnapshotId: setSnapshotIdReducer,
    setToggled: setToggledReducer,
    setToolType: setToolTypeReducer,
    toggleWorkspaceView: toggleWorkspaceViewReducer,
    undoLabeling: undoLabelingReducer,
    updateWorkspaceView: updateWorkspaceViewReducer,
  },
});

export const {
  addObject,
  addObjectCopyFrame,
  addObjectCopy,
  addObjectMerge,
  addObjectSplit,
  addSelectedObject,
  deleteBackward,
  deleteForward,
  deleteObjects,
  deselectObject,
  moveCurrentFrame,
  redoLabeling,
  resetLabeling,
  selectObject,
  setAttribute,
  setCurrentFrame,
  setDrawingTool,
  setDuration,
  setFilters,
  setIsDone,
  setIsTracked,
  setName,
  setObjectFirstFrame,
  setObjectLastFrame,
  setObjectsIsDone,
  setPreferences,
  setSelected,
  setSelectedAll,
  setSelectedNext,
  setSelectedObject,
  setShortcut,
  setSnapshot,
  setSnapshotId,
  setToggled,
  setToolType,
  toggleWorkspaceView,
  undoLabeling,
  updateWorkspaceView,
} = workspaceReducer.actions;

export default workspaceReducer.reducer;
