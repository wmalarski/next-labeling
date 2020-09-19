import { createContext } from "react";

export interface FramesContextValue {
  currentFrame: number;
  duration: number;
  setDuration: (duration: number) => void;
  moveBy: (value: number) => void;
  moveTo: (frame: number) => void;
}

const FramesContext = createContext<FramesContextValue>({
  currentFrame: 0,
  duration: 1,
  setDuration: () => void 0,
  moveBy: () => void 0,
  moveTo: () => void 0,
});

export default FramesContext;
