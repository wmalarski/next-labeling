import Typography from "@material-ui/core/Typography";
import TreeItem, { TreeItemProps } from "@material-ui/lab/TreeItem/TreeItem";
import React from "react";

import { ExtendedObject } from "../../utils/labeling/types";
import { ObjectCanvas } from "./objectCanvas";
import { TimelineFieldItem } from "./timelineFieldItem";

export interface TimelineObjectItemProps extends TreeItemProps {
  object: ExtendedObject;
}

export function TimelineObjectItem(
  props: TimelineObjectItemProps,
): JSX.Element {
  const { object, ...other } = props;
  const { fields } = object;

  const width = 600;
  const height = 50;
  const shiftX = 100;

  return (
    <TreeItem
      onLabelClick={event => event.preventDefault()}
      label={
        <ObjectCanvas
          object={object}
          width={width}
          height={height}
          shiftX={shiftX}
        />
      }
      {...other}
    >
      {fields.map(field => {
        return (
          <TimelineFieldItem
            nodeId={`${object.id}|${field.id}`}
            key={field.id}
            field={field}
            object={object}
          />
        );
      })}
    </TreeItem>
  );
}
