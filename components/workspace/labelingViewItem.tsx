import dynamic from "next/dynamic";
import React from "react";
import GridLayout from "react-grid-layout";
import "../../node_modules/react-grid-layout/css/styles.css";
import "../../node_modules/react-resizable/css/styles.css";
import { LabelingView } from "../../utils/labeling/views";
import EditorTable from "../editors/editorTable";
import TimelineView from "../timeline/timelineView";
import FrameSlider from "../workspace/frameSlider";
import LabelingViewCard from "./labelingViewCard";

const KonvaStageNoSSR = dynamic(() => import("../visualization/konvaStage"), {
  ssr: false,
});

export interface LabelingViewItemProps {
  documentId: string;
  view: GridLayout.Layout;
}

export default function LabelingViewItem(
  props: LabelingViewItemProps,
): JSX.Element | null {
  const { view } = props;
  switch (view.i) {
    case LabelingView.VIDEO:
      return (
        <LabelingViewCard view={view} title="Video">
          <KonvaStageNoSSR />
        </LabelingViewCard>
      );
    // case LabelingView.COMMENTS:
    //   return (
    //     <LabelingViewCard view={view} title="Video">
    //        <CommentChat documentId={documentId} />
    //     </LabelingViewCard>
    //   );
    case LabelingView.PROPERTIES:
      return (
        <LabelingViewCard view={view} title="Properties" isClosable>
          <EditorTable />
        </LabelingViewCard>
      );
    case LabelingView.TIMELINE:
      return (
        <LabelingViewCard view={view} title="Timeline" isClosable>
          <TimelineView />
        </LabelingViewCard>
      );
    case LabelingView.SLIDER:
      return (
        <LabelingViewCard view={view} title="Frames">
          <FrameSlider />
        </LabelingViewCard>
      );
    default:
      return null;
  }
}
