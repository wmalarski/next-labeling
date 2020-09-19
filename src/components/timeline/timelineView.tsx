import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import TreeView from "@material-ui/lab/TreeView/TreeView";
import React, { useContext } from "react";

import FramesContext from "../../contexts/frames/framesContext";
import LabelingContext from "../../contexts/labeling/labelingContext";
import SelectionContext, {
  ObjectSelection,
} from "../../contexts/selection/selectionContext";
import {
  calculateObjectBlocks,
  pairObjectsToSchema,
} from "../../utils/labeling/functions";
import { TimelineFieldItem } from "./timelineFieldItem";
import { TimelineItem } from "./timelineItem";

export default function TimelineView(): JSX.Element {
  const { history, document } = useContext(LabelingContext);
  const { duration } = useContext(FramesContext);
  const { selected: selectedObjects, select, toggle, toggled } = useContext(
    SelectionContext,
  );

  const { objects } = history.data;
  const pairs = pairObjectsToSchema(objects, document.schema);

  const selected = selectedObjects.flatMap(object => [
    ...(object.objectSelected ? [object.objectId] : []),
    ...object.fieldIds.map(field => `${object.objectId}|${field}`),
  ]);

  const handleToggle = (_event: any, nodeIds: string[]) => {
    toggle(nodeIds);
  };

  const handleSelect = (event: any, nodeIds: string[]) => {
    const result = Object.values(
      nodeIds.reduce<{ [objectId: string]: ObjectSelection }>((prev, curr) => {
        const [objectId, fieldId] = curr.split("|");
        const prevFields = prev[objectId] ?? {
          objectId,
          fieldIds: [],
          objectSelected: !fieldId,
          singleton:
            pairs.find(pair => pair.object.id === objectId)?.objectSchema
              .singleton ?? true,
        };
        return {
          ...prev,
          [objectId]: {
            ...prevFields,
            fieldIds: fieldId
              ? [...prevFields.fieldIds, fieldId]
              : prevFields.fieldIds,
            objectSelected: prevFields.objectSelected || !fieldId,
          },
        };
      }, {}),
    );
    select(result);
  };

  return (
    <TreeView
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      defaultEndIcon={<div style={{ width: 24 }} />}
      expanded={toggled}
      selected={selected}
      onNodeToggle={handleToggle}
      onNodeSelect={handleSelect}
      multiSelect
    >
      {pairs.map(pair => {
        const { object, objectSchema } = pair;
        const changes = calculateObjectBlocks(object, duration);
        // console.log({ changes });
        return (
          <TimelineItem
            key={object.id}
            nodeId={object.id}
            labelText={`${object.name} + ${changes}`}
            onLabelClick={event => event.preventDefault()}
            onChange={event => console.log("event", event)}
          >
            {object.fields.map(field => {
              const fieldSchema = objectSchema.fields.find(
                schema => schema.id === field.schemaFieldId,
              );
              return fieldSchema ? (
                <TimelineFieldItem
                  key={field.id}
                  nodeId={`${object.id}|${field.id}`}
                  field={field}
                  isSingleton={objectSchema.singleton}
                  fieldSchema={fieldSchema}
                  frames={object.frames}
                />
              ) : (
                <></>
              );
            })}
          </TimelineItem>
        );
      })}{" "}
    </TreeView>
  );
}
