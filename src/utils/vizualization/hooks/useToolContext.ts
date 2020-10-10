import { useContext } from "react";

import ToolContext, { ToolContextValue } from "../contexts/toolContext";

export default function useToolContext(): ToolContextValue {
  return useContext(ToolContext);
}
