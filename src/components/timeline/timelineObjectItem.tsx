import TreeItem, { TreeItemProps } from "@material-ui/lab/TreeItem/TreeItem";
import React from "react";

import { calculateObjectBlocks } from "../../utils/labeling/functions";
import { ExtendedObject } from "../../utils/labeling/types";
import useLabelingContext from "../../utils/labeling/useLabelingContext";
import { FieldCanvas } from "./fieldCanvas";
import { ObjectCanvas } from "./objectCanvas";

export interface TimelineObjectItemProps extends TreeItemProps {
  object: ExtendedObject;
  selected: string[];
}

export function TimelineObjectItem(
  props: TimelineObjectItemProps,
): JSX.Element {
  const { object, selected, ...other } = props;
  const { fields } = object;
  const isObjectSelected = selected.includes(object.id);

  const width = 600;
  const height = 50;
  const shiftX = 100;
  const fieldOffset = 18;
  const fontSize = 14;

  const { duration } = useLabelingContext();
  const blocks = calculateObjectBlocks(object, duration);

  return (
    <TreeItem
      onLabelClick={event => event.preventDefault()}
      label={
        <ObjectCanvas
          object={object}
          blocks={blocks}
          width={width}
          height={height}
          shiftX={shiftX}
          fontSize={fontSize}
          isSelected={isObjectSelected}
        />
      }
      {...other}
    >
      {fields.map(field => {
        const nodeId = `${object.id}|${field.id}`;
        const isFieldSelected = selected.includes(nodeId);
        return (
          <TreeItem
            nodeId={nodeId}
            key={field.id}
            label={
              <FieldCanvas
                field={field}
                blocks={blocks}
                width={width}
                height={height}
                shiftX={shiftX - fieldOffset}
                isSelected={isFieldSelected}
                fontSize={fontSize}
              />
            }
          />
        );
      })}
    </TreeItem>
  );
}
