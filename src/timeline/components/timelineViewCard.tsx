import React from "react";
import GridLayout from "react-grid-layout";
import "../../../node_modules/react-grid-layout/css/styles.css";
import "../../../node_modules/react-resizable/css/styles.css";
import LabelingViewCard from "../../workspace/components/labelingViewCard";
import {
  TimelineDefaultZoom,
  TimelineMaxZoom,
  TimelineMinZoom,
  TimelineZoomStep,
} from "../constants";
import useXZoom from "../hooks/useXZoom";
import { TimelineFilterControls } from "./timelineFilterControls";
import TimelineView from "./timelineView";

export interface TimelineViewCardProps {
  view: GridLayout.Layout;
}

export default function TimelineViewCard(
  props: TimelineViewCardProps,
): JSX.Element | null {
  const { view } = props;

  const zoom = useXZoom({
    step: TimelineZoomStep,
    min: TimelineMinZoom,
    max: TimelineMaxZoom,
    default: TimelineDefaultZoom,
  });
  const { scaleX, stageX } = zoom;

  return (
    <LabelingViewCard
      view={view}
      title="Timeline"
      isClosable
      toolbar={<TimelineFilterControls zoom={zoom} />}
    >
      <TimelineView width={1000} scaleX={scaleX} stageX={stageX} />
    </LabelingViewCard>
  );
}
