import { useTheme } from "@material-ui/core";
import React, { useContext } from "react";
import { Layer, Line, Rect, Stage, Text } from "react-konva";

import FramesContext from "../../contexts/frames/framesContext";
import SelectionContext from "../../contexts/selection/selectionContext";
import { calculateObjectBlocks } from "../../utils/labeling/functions";
import { ExtendedObject } from "../../utils/labeling/types";

export interface ObjectCanvasProps {
  object: ExtendedObject;
  width: number;
  height: number;
  shiftX: number;
}

export function ObjectCanvas(props: ObjectCanvasProps): JSX.Element {
  const { object, width, height, shiftX } = props;

  const theme = useTheme();
  console.log({ theme });
  const selectionColor = theme.palette.primary.light;
  const deselectionColor = theme.palette.primary.dark;
  const errorColor = theme.palette.error.light;

  const { duration, currentFrame } = useContext(FramesContext);
  const changes = calculateObjectBlocks(object, duration);

  const { selected } = useContext(SelectionContext);
  const isSelected = !!selected.find(
    selection => selection.objectId === object.id,
  );

  const scale = width / duration;
  return (
    <Stage width={shiftX + width} height={height}>
      <Layer>
        {changes.map(block => (
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
        <Text text={object.name} />
      </Layer>
    </Stage>
  );
}
