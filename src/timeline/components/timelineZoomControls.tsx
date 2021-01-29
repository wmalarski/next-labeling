import IconButton from "@material-ui/core/IconButton";
import Slider from "@material-ui/core/Slider";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import React, { useCallback } from "react";
import {
  TimelineDefaultZoom,
  TimelineMaxZoom,
  TimelineMinZoom,
  TimelineZoomStep,
} from "../constants";
import { UseXZoomResult } from "../hooks/useXZoom";

export interface TimelineZoomControlsProps {
  zoom: UseXZoomResult;
  index: number;
}

export function TimelineZoomControls(
  props: TimelineZoomControlsProps,
): JSX.Element {
  const { zoom, index } = props;
  const { scaleX, handleSetScaleX, handleZoomIn, handleZoomOut } = zoom;

  const onZoomInClicked = useCallback(() => handleZoomIn(index), [
    index,
    handleZoomIn,
  ]);

  const onZoomOutClicked = useCallback(() => handleZoomOut(index), [
    index,
    handleZoomOut,
  ]);

  const onZoomChanged = useCallback(
    (_event: React.ChangeEvent<any>, value: number | number[]): void => {
      if (Array.isArray(value)) return;
      handleSetScaleX(value, index);
    },
    [index, handleSetScaleX],
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
