import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import TreeView from "@material-ui/lab/TreeView/TreeView";
import React, { useMemo } from "react";

import { labelingFilter } from "../../utils/labeling/functions";
import useLabelingContext from "../../utils/labeling/hooks/useLabelingContext";
import { ObjectSelection } from "../../utils/labeling/types/client";
import setSelectedUpdate from "../../utils/labeling/updates/setSelectedUpdate";
import setToggledUpdate from "../../utils/labeling/updates/setToggledUpdate";
import { TimelineFilterControls } from "./timelineFilterControls";
import { TimelineObjectItem } from "./timelineObjectItem";

export default function TimelineView(): JSX.Element {
  const { history, filters } = useLabelingContext();
  const { pushLabeling } = history;

  const { objects, selected: selectedObjects, toggled } = history.data;

  const filteredObjects = useMemo(
    () => objects.filter(labelingFilter(filters)),
    [filters, objects],
  );

  const selected = useMemo(
    () =>
      selectedObjects.flatMap(object => [
        ...(object.objectSelected ? [object.objectId] : []),
        ...object.fieldIds.map(field => `${object.objectId}|${field}`),
      ]),
    [selectedObjects],
  );

  const handleToggle = (_event: any, nodeIds: string[]) =>
    pushLabeling(data => setToggledUpdate(data, nodeIds));

  const handleSelect = (_event: any, nodeIds: string[]) => {
    const result = Object.values(
      nodeIds.reduce<{ [objectId: string]: ObjectSelection }>((prev, curr) => {
        const [objectId, fieldId] = curr.split("|");
        const prevFields = prev[objectId] ?? {
          objectId,
          fieldIds: [],
          objectSelected: !fieldId,
          singleton:
            objects.find(object => object.id === objectId)?.objectSchema
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
    pushLabeling(data => setSelectedUpdate(data, result));
  };

  return (
    <>
      <TimelineFilterControls />
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
        {filteredObjects.map(object => (
          <TimelineObjectItem
            nodeId={object.id}
            key={object.id}
            object={object}
            selected={selected}
          />
        ))}
      </TreeView>
    </>
  );
}
