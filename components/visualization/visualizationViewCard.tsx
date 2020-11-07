import dynamic from "next/dynamic";
import React from "react";
import GridLayout from "react-grid-layout";
import "../../node_modules/react-grid-layout/css/styles.css";
import "../../node_modules/react-resizable/css/styles.css";
import useZoom from "../../utils/visualization/hooks/useZoom";
import LabelingViewCard from "../workspace/labelingViewCard";
import ToolsHeader from "./toolsHeader";

const VisualizationStageNoSSR = dynamic(
  () => import("../visualization/visualizationStage"),
  {
    ssr: false,
  },
);

export interface VisualizationViewCardProps {
  view: GridLayout.Layout;
  width: number;
  height: number;
}

export default function VisualizationViewCard(
  props: VisualizationViewCardProps,
): JSX.Element | null {
  const { width, height, view } = props;

  const zoom = useZoom({ scaleBy: 1.1 });
  const { handleReset, handleZoomIn, handleZoomOut } = zoom;

  return (
    <LabelingViewCard
      view={view}
      title="Video"
      toolbar={
        <ToolsHeader
          onResetClicked={handleReset}
          onZoomInClicked={() => handleZoomIn({ x: width / 2, y: height / 2 })}
          onZoomOutlicked={() => handleZoomOut({ x: width / 2, y: height / 2 })}
        />
      }
    >
      <VisualizationStageNoSSR width={1000} height={1000} zoom={zoom} />
    </LabelingViewCard>
  );
}
