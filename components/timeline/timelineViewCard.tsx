import React from "react";
import GridLayout from "react-grid-layout";
import "../../node_modules/react-grid-layout/css/styles.css";
import "../../node_modules/react-resizable/css/styles.css";
import LabelingViewCard from "../workspace/labelingViewCard";
import { TimelineFilterControls } from "./timelineFilterControls";
import TimelineView from "./timelineView";

export interface TimelineViewCardProps {
  view: GridLayout.Layout;
}

export default function TimelineViewCard(
  props: TimelineViewCardProps,
): JSX.Element | null {
  const { view } = props;

  return (
    <LabelingViewCard
      view={view}
      title="Timeline"
      isClosable
      toolbar={<TimelineFilterControls />}
    >
      <TimelineView width={1000} scaleX={1} />
    </LabelingViewCard>
  );
}
