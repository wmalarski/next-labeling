import IconButton from "@material-ui/core/IconButton";
import Slider from "@material-ui/core/Slider";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { currentFrameSelector } from "../../workspace/redux/selectors";
import {
  TimelineDefaultZoom,
  TimelineMaxZoom,
  TimelineMinZoom,
  TimelineZoomStep,
} from "../constants";
import { UseXZoomResult } from "../hooks/useXZoom";

export interface TimelineZoomControlsProps {
  zoom: UseXZoomResult;
}

function TimelineZoomControls(props: TimelineZoomControlsProps): JSX.Element {
  const { zoom } = props;
  const { scaleX, handleSetScaleX, handleZoomIn, handleZoomOut } = zoom;

  const currentFrame = useSelector(currentFrameSelector);

  const onZoomInClicked = useCallback(() => handleZoomIn(currentFrame), [
    currentFrame,
    handleZoomIn,
  ]);

  const onZoomOutClicked = useCallback(() => handleZoomOut(currentFrame), [
    currentFrame,
    handleZoomOut,
  ]);

  const onZoomChanged = useCallback(
    (_event: React.ChangeEvent<any>, value: number | number[]): void => {
      if (Array.isArray(value)) return;
      handleSetScaleX(value, currentFrame);
    },
    [currentFrame, handleSetScaleX],
  );

  return (
    <div style={{ display: "flex" }}>
      <IconButton
        disabled={scaleX <= TimelineMinZoom}
        onClick={onZoomInClicked}
      >
        <ZoomInIcon />
      </IconButton>
      <Slider
        value={scaleX}
        valueLabelDisplay="auto"
        marks={[{ value: TimelineDefaultZoom }]}
        min={TimelineMinZoom}
        max={TimelineMaxZoom}
        step={TimelineZoomStep}
        onChange={onZoomChanged}
      />
      <IconButton
        disabled={scaleX >= TimelineMaxZoom}
        onClick={onZoomOutClicked}
      >
        <ZoomOutIcon />
      </IconButton>
    </div>
  );
}

export default React.memo(TimelineZoomControls);
