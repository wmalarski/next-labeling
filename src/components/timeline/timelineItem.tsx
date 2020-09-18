import Typography from "@material-ui/core/Typography";
import TreeItem, { TreeItemProps } from "@material-ui/lab/TreeItem/TreeItem";
import React from "react";

export interface TimelineItemProps extends TreeItemProps {
  labelInfo?: string;
  labelText: string;
}

export function TimelineItem(props: TimelineItemProps): JSX.Element {
  const { labelText, labelInfo, ...other } = props;

  return (
    <TreeItem
      label={
        <div>
          <Typography variant="body2">{labelText}</Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </div>
      }
      {...other}
    />
  );
}
