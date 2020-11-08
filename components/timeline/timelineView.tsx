import React, { useCallback, useMemo } from "react";
import { Layer, Stage } from "react-konva";
import { labelingFilter } from "../../utils/labeling/functions";
import useLabelingContext from "../../utils/labeling/hooks/useLabelingContext";
import { ObjectSelection } from "../../utils/labeling/types/client";
import setSelectedUpdate from "../../utils/labeling/updates/setSelectedUpdate";
import setToggledUpdate from "../../utils/labeling/updates/setToggledUpdate";
import { TimelineRowHeight } from "../../utils/timeline/constansts";
import { getTimelineObjectShapeConfigs } from "../../utils/timeline/functions";
import TimelineObjectShape from "./timelineObjectShape";

export default function TimelineView(): JSX.Element {
  const { history, filters, duration } = useLabelingContext();
  const { pushLabeling } = history;

  const { objects, selected, toggled } = history.data;

  const configs = useMemo(
    () =>
      getTimelineObjectShapeConfigs(
        objects.filter(labelingFilter(filters)),
        toggled,
        duration,
      ),
    [duration, filters, objects, toggled],
  );

  const rowCount = useMemo(
    () =>
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

  const width = 600;
  return (
    <Stage width={width} height={rowCount * TimelineRowHeight}>
      <Layer scaleX={0.5}>
        {configs.map(config => (
          <TimelineObjectShape
            key={config.object.id}
            selection={selected.find(sel => sel.objectId === config.object.id)}
            rowHeight={TimelineRowHeight}
            duration={duration}
            {...config}
            onSelect={handleSelect}
            onToggle={handleToggle}
          />
        ))}
      </Layer>
    </Stage>
  );
}
