import { createContext } from "react";

export enum ToolType {
  SELECTOR,
  ZOOM_AND_PANE,
  DRAWING_TOOL,
}

export interface ToolContextState {
  toolType: ToolType;
  objectId?: string;
}

export interface ToolContextValue extends ToolContextState {
  setTool: (state: ToolContextState) => void;
}

const ToolContext = createContext<ToolContextValue>({
  toolType: ToolType.SELECTOR,
  setTool: () => void 0,
});

export default ToolContext;
