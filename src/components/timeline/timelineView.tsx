import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import TreeView from "@material-ui/lab/TreeView/TreeView";
import React, { useContext } from "react";

import FramesContext from "../../contexts/frames/framesContext";
import LabelingContext from "../../contexts/labeling/labelingContext";
import SelectionContext from "../../contexts/selection/selectionContext";
import { TimelineItem } from "./timelineItem";

export default function TimelineView(): JSX.Element {
  const { history } = useContext(LabelingContext);
  const { currentFrame } = useContext(FramesContext);
  const { selected } = useContext(SelectionContext);

  return (
    <TreeView
      defaultExpanded={["3"]}
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      defaultEndIcon={<div style={{ width: 24 }} />}
    >
      <TimelineItem nodeId="1" labelText="All Mail" />
      <TimelineItem nodeId="2" labelText="Trash" />
      <TimelineItem nodeId="3" labelText="Categories">
        <TimelineItem nodeId="5" labelText="Social" labelInfo="90" />
        <TimelineItem nodeId="6" labelText="Updates" labelInfo="2,294" />
        <TimelineItem nodeId="7" labelText="Forums" labelInfo="3,566" />
        <TimelineItem nodeId="8" labelText="Promotions" labelInfo="733" />
      </TimelineItem>
      <TimelineItem nodeId="4" labelText="History" />
    </TreeView>
  );
}
