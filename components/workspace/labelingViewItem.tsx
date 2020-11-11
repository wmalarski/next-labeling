import React from "react";
import GridLayout from "react-grid-layout";
import "../../node_modules/react-grid-layout/css/styles.css";
import "../../node_modules/react-resizable/css/styles.css";
import { LabelingView } from "../../utils/labeling/views";
import EditorTable from "../editors/editorTable";
import TimelineViewCard from "../timeline/timelineViewCard";
import VisualizationViewCard from "../video/videoViewCard";
import FrameSlider from "../workspace/frameSlider";
import LabelingViewCard from "./labelingViewCard";

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
      return <VisualizationViewCard width={1000} height={1000} view={view} />;
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
      return <TimelineViewCard view={view} />;
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
