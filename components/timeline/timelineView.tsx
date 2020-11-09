import { useTheme } from "@material-ui/core";
import compact from "lodash/compact";
import React, { useCallback, useMemo } from "react";
import { Layer, Line, Stage } from "react-konva";
import { frameToRange, labelingFilter } from "../../utils/labeling/functions";
import useLabelingContext from "../../utils/labeling/hooks/useLabelingContext";
import usePreferences from "../../utils/labeling/hooks/usePreferencesContext";
import { LabelingObject } from "../../utils/labeling/types/client";
import setCurrentFrameUpdate from "../../utils/labeling/updates/setCurrentFrameUpdate";
import setSelectedUpdate from "../../utils/labeling/updates/setSelectedUpdate";
import setToggledUpdate from "../../utils/labeling/updates/setToggledUpdate";
import {
  TimelineRowHeight,
  TimelineVerticalLineWidth,
} from "../../utils/timeline/constansts";
import { getTimelineObjectConfigs } from "../../utils/timeline/functions";
import TimelineLabel from "./timelineLabel";
import TimelineObject from "./timelineObject";

export interface TimelineViewProps {
  width: number;
  scaleX: number;
}

export default function TimelineView(props: TimelineViewProps): JSX.Element {
  const { width, scaleX } = props;

  const { history, filters, duration } = useLabelingContext();
  const { pushLabeling, data } = history;
  const { objects, selected, toggled, currentFrame } = data;

  const { preferences } = usePreferences();
  const { frameChangeStep: frameStep } = preferences;

  const theme = useTheme();
  const errorColor = theme.palette.error.light;

  const configs = useMemo(
    () =>
      getTimelineObjectConfigs(
        objects.filter(labelingFilter(filters)),
        toggled,
        duration,
      ),
    [duration, filters, objects, toggled],
  );

  const height = useMemo(
    () =>
      TimelineRowHeight *
      configs
        .map(config => config.fieldBlocks.length + 1)
        .reduce<number>((a, b) => a + b, 0),
    [configs],
  );

  const handleToggle = useCallback(
    (id: string): void =>
      pushLabeling(doc =>
        setToggledUpdate(
          doc,
          doc.toggled.includes(id)
            ? doc.toggled.filter(t => t !== id)
            : [...doc.toggled, id],
        ),
      ),
    [pushLabeling],
  );

  const selectedNodes = useMemo(
    () =>
      selected.flatMap(object => [
        ...(object.objectSelected ? [object.objectId] : []),
        ...object.fieldIds.map(field => `${object.objectId}|${field}`),
      ]),
    [selected],
  );

  const handleSelect = useCallback(
    (object: LabelingObject, reset: boolean, fieldId?: string) =>
      pushLabeling(doc => {
        const index = doc.selected.findIndex(sel => sel.objectId === object.id);
        if (index === -1)
          return setSelectedUpdate(doc, [
            ...(reset ? [] : doc.selected),
            {
              fieldIds: fieldId ? [fieldId] : [],
              objectId: object.id,
              objectSelected: !fieldId,
              singleton: object.objectSchema.singleton,
            },
          ]);

        const selection = doc.selected[index];
        const newSelection = {
          ...selection,
          ...(!fieldId
            ? {
                objectSelected: true,
                fieldIds: reset ? [] : selection.fieldIds,
              }
            : {
                objectSelected: reset ? false : selection.objectSelected,
                fieldIds: reset ? [fieldId] : [...selection.fieldIds, fieldId],
              }),
        };
        if (reset) return setSelectedUpdate(doc, [newSelection]);
        const newSelected = [...doc.selected];
        newSelected.splice(index, 1, newSelection);
        return setSelectedUpdate(doc, newSelected);
      }),
    [pushLabeling],
  );

  const handleDeselect = useCallback(
    (object: LabelingObject, reset: boolean, fieldId?: string) =>
      pushLabeling(doc =>
        setSelectedUpdate(
          doc,
          reset && !fieldId
            ? []
            : compact(
                doc.selected.map(sel => {
                  if (sel.objectId !== object.id) return sel;
                  if (!fieldId) return null;
                  return {
                    ...sel,
                    fieldIds: reset
                      ? []
                      : sel.fieldIds.filter(f => f !== fieldId),
                  };
                }),
              ),
        ),
      ),
    [pushLabeling],
  );

  const handleFrameSelected = useCallback(
    (index: number): void =>
      pushLabeling(doc =>
        setCurrentFrameUpdate(
          doc,
          frameToRange(Number(index), duration),
          frameStep,
        ),
      ),
    [duration, frameStep, pushLabeling],
  );
  const arrowWidth = 30;
  const labelsWidth = 160;
  return (
    <Stage width={width} height={height}>
      <Layer>
        {configs.map(config => (
          <TimelineLabel
            key={config.object.id}
            rowHeight={TimelineRowHeight}
            arrowWidth={arrowWidth}
            horPadding={8}
            verPadding={14}
            {...config}
            onToggle={handleToggle}
          />
        ))}
      </Layer>
      <Layer x={labelsWidth} scaleX={scaleX}>
        {configs.map(config => (
          <TimelineObject
            key={config.object.id}
            rowHeight={TimelineRowHeight}
            duration={duration}
            selectedNodes={selectedNodes}
            {...config}
            onSelect={handleSelect}
            onDeselect={handleDeselect}
            onFrameSelected={handleFrameSelected}
          />
        ))}
      </Layer>
      <Layer x={labelsWidth}>
        <Line
          points={[
            (currentFrame + 0.5) * scaleX,
            0,
            (currentFrame + 0.5) * scaleX,
            height,
          ]}
          stroke={errorColor}
          strokeWidth={TimelineVerticalLineWidth}
        />
      </Layer>
    </Stage>
  );
}
