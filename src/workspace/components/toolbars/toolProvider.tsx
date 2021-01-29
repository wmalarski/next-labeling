import React, { useState } from "react";
import ToolContext, { ToolContextState } from "../../contexts/toolContext";
import { ToolType } from "../../types/client";

export interface ToolProviderProps {
  children: React.ReactNode | React.ReactNode[] | null;
}

export default function ToolProvider(props: ToolProviderProps): JSX.Element {
  const { children } = props;

  const [state, setState] = useState<ToolContextState>({
    toolType: ToolType.ZOOM_AND_PANE,
  });

  return (
    <ToolContext.Provider value={{ ...state, setTool: setState }}>
      {children}
    </ToolContext.Provider>
  );
}
