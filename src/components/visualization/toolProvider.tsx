import React, { useState } from "react";
import ToolContext, {
  ToolContextState,
} from "../../utils/vizualization/contexts/toolContext";
import { ToolType } from "../../utils/vizualization/types";

export interface ToolProviderProps {
  children: React.ReactNode | React.ReactNode[] | null;
}

export default function ToolProvider(props: ToolProviderProps): JSX.Element {
  const { children } = props;

  const [state, setState] = useState<ToolContextState>({
    toolType: ToolType.SELECTOR,
  });

  return (
    <ToolContext.Provider value={{ ...state, setTool: setState }}>
      {children}
    </ToolContext.Provider>
  );
}
