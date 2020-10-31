import { useTheme } from "@material-ui/core";
import { TextConfig } from "konva/types/shapes/Text";
import React, { useState } from "react";
import { Layer, Line, Rect, Stage, Text } from "react-konva";
import {
  darkerTimelineColors,
  lighterColors,
} from "../../themes/timelineColors";
import {
  calculateFieldBlocks,
  ObjectBlock,
  TimelineVerticalLineWidth,
} from "../../utils/editors/timeline";
import useLabelingContext from "../../utils/labeling/hooks/useLabelingContext";
import { LabelingField } from "../../utils/labeling/types/client";

export interface FieldCanvasProps {
  field: LabelingField;
  blocks: ObjectBlock[];
  isSelected: boolean;
  width: number;
  height: number;
  shiftX: number;
  fontSize: number;
}

export default function FieldCanvas(props: FieldCanvasProps): JSX.Element {
  const { field, blocks, isSelected, width, height, shiftX, fontSize } = props;

  const theme = useTheme();
  // const selectionColor = theme.palette.primary.light;
  // const deselectionColor = theme.palette.primary.dark;
  const errorColor = theme.palette.error.light;

  const { duration, history } = useLabelingContext();
  const { currentFrame } = history.data;
  const scale = width / duration;
  const fieldBlocks = calculateFieldBlocks(field, blocks, duration);

  const [tooltip, setTooltip] = useState<TextConfig>({});

  return (
    <>
      <Stage width={shiftX + width} height={height}>
        <Layer>
          {fieldBlocks.map(block => (
            <Rect
              key={block.firstFrame}
              x={shiftX + block.firstFrame * scale}
              y={0}
              width={(block.lastFrame + 1 - block.firstFrame) * scale}
              height={height}
              fill={
                isSelected
                  ? lighterColors[block.index]
                  : darkerTimelineColors[block.index]
              }
              onMouseEnter={() =>
                setTooltip({
                  text: block.value,
                  visible: true,
                })
              }
              onMouseLeave={() => setTooltip({ visible: false })}
            />
          ))}
          <Line
            points={[
              shiftX + (currentFrame + 0.5) * scale,
              0,
              shiftX + (currentFrame + 0.5) * scale,
              height,
            ]}
            stroke={errorColor}
            strokeWidth={TimelineVerticalLineWidth}
          />
        </Layer>
        <Layer>
          <Text text={field.fieldSchema.name} fontSize={fontSize} />
          <Text y={height / 2} fontSize={fontSize} {...tooltip} />
        </Layer>
      </Stage>
    </>
  );
}
