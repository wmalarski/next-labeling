import { useTheme } from "@material-ui/core";
import React, { useCallback, useMemo } from "react";
import { Layer, Line, Stage } from "react-konva";
import { frameToRange, labelingFilter } from "../../utils/labeling/functions";
import useLabelingContext from "../../utils/labeling/hooks/useLabelingContext";
import usePreferences from "../../utils/labeling/hooks/usePreferencesContext";
import { ObjectSelection } from "../../utils/labeling/types/client";
import setCurrentFrameUpdate from "../../utils/labeling/updates/setCurrentFrameUpdate";
import setSelectedUpdate from "../../utils/labeling/updates/setSelectedUpdate";
import setToggledUpdate from "../../utils/labeling/updates/setToggledUpdate";
import {
  TimelineRowHeight,
  TimelineVerticalLineWidth,
} from "../../utils/timeline/constansts";
import { getTimelineObjectShapeConfigs } from "../../utils/timeline/functions";
import TimelineObjectShape from "./timelineObjectShape";
import TimelineObjectText from "./timelineObjectText";
import TimelineToggleButton from "./timelineToggleButton";

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
      getTimelineObjectShapeConfigs(
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

  const handleSelect = useCallback(
    (selection: ObjectSelection, reset: boolean): void =>
      pushLabeling(doc =>
        setSelectedUpdate(
          doc,
          reset
            ? [selection]
            : [
                ...doc.selected.filter(
                  sel => sel.objectId !== selection.objectId,
                ),
                selection,
              ],
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

  const toggleButtonsWidth = 30;
  return (
    <Stage width={width} height={height}>
      <Layer x={toggleButtonsWidth} scaleX={scaleX}>
        {configs.map(config => (
          <TimelineObjectShape
            key={config.object.id}
            selection={selected.find(sel => sel.objectId === config.object.id)}
            rowHeight={TimelineRowHeight}
            duration={duration}
            {...config}
            onSelect={handleSelect}
            onFrameSelected={handleFrameSelected}
          />
        ))}
      </Layer>
      <Layer x={toggleButtonsWidth}>
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
        {configs.map(config => (
          <TimelineObjectText
            key={config.object.id}
            scaleX={scaleX}
            selection={selected.find(sel => sel.objectId === config.object.id)}
            rowHeight={TimelineRowHeight}
            {...config}
            onSelect={handleSelect}
          />
        ))}
      </Layer>
      <Layer>
        {configs.map(config => (
          <TimelineToggleButton
            key={config.object.id}
            rowHeight={TimelineRowHeight}
            width={toggleButtonsWidth}
            horPadding={8}
            verPadding={14}
            {...config}
            onToggle={handleToggle}
          />
        ))}
      </Layer>
    </Stage>
  );
}
