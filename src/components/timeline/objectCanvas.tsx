import { useTheme } from "@material-ui/core";
import React from "react";
import { Layer, Line, Rect, Stage, Text } from "react-konva";

import { ObjectBlock } from "../../utils/labeling/functions";
import { ExtendedObject } from "../../utils/labeling/types";
import useLabelingContext from "../../utils/labeling/useLabelingContext";

export interface ObjectCanvasProps {
  object: ExtendedObject;
  blocks: ObjectBlock[];
  isSelected: boolean;
  width: number;
  height: number;
  shiftX: number;
  fontSize: number;
}

export function ObjectCanvas(props: ObjectCanvasProps): JSX.Element {
  const { object, blocks, isSelected, width, height, shiftX, fontSize } = props;

  const theme = useTheme();
  const selectionColor = theme.palette.primary.light;
  const deselectionColor = theme.palette.primary.dark;
  const errorColor = theme.palette.error.light;

  const { duration, history } = useLabelingContext();
  const { currentFrame } = history.data;
  const scale = width / duration;

  return (
    <Stage width={shiftX + width} height={height}>
      <Layer>
        {blocks.map(block => (
          <Rect
            key={block.firstFrame}
            x={shiftX + block.firstFrame * scale}
            y={0}
            width={(block.lastFrame + 1 - block.firstFrame) * scale}
            height={height}
            fill={isSelected ? selectionColor : deselectionColor}
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
          strokeWidth={1 * scale}
        />
        <Text
          text={object.name}
          fontSize={fontSize + 2}
          y={(height - fontSize + 2) / 2}
        />
      </Layer>
    </Stage>
  );
}
