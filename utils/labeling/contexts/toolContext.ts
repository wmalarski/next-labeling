import { createContext } from "react";
import { ToolType } from "../types/client";

export interface ToolContextState {
  toolType: ToolType;
  objectId?: string;
}

export interface ToolContextValue extends ToolContextState {
  setTool: (state: ToolContextState) => void;
}

const ToolContext = createContext<ToolContextValue>({
  toolType: ToolType.ZOOM_AND_PANE,
  setTool: () => void 0,
});

export default ToolContext;
