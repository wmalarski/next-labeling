import { Container, Sprite, Stage, Text } from "@inlet/react-pixi";
import * as PIXI from "pixi.js";
import React from "react";

import { applyLabelingFilters } from "../../utils/labeling/functions";
import useLabelingContext from "../../utils/labeling/hooks/useLabelingContext";
import useDrawingTool from "../../utils/visualization/hooks/useDrawingTool";
import useToolContext from "../../utils/visualization/hooks/useToolContext";
import useZoomAndPane from "../../utils/visualization/hooks/useZoomAndPane";
import { MouseButton, ToolType } from "../../utils/visualization/types";
import { PixiFinishedObject, PixiInProgressObject } from "./pixiObject";
import ToolsHeader from "./toolsHeader";

export default function MainStage(): JSX.Element {
  const {
    document,
    history,
    duration,
    setDuration,
    filters,
  } = useLabelingContext();
  const { currentFrame, objects, selected } = history.data;
  const fps = document.fps ?? 24;

  const { toolType } = useToolContext();

  const drawingTool = useDrawingTool();
  const { acceptPoint, pushPoint, builderState } = drawingTool.builderResult;
  const drawingSchema = drawingTool.field?.fieldSchema;
  const drawingStage = builderState.currentValue?.stage;
  const drawingValue = builderState.currentValue?.value;

  const finishedObjects = applyLabelingFilters(objects, filters).flatMap(
    object => {
      const isSelected = selected.some(sel => sel.objectId === object.id);
      return object.fields.map(field => (
        <PixiFinishedObject
          key={field.id}
          isSelected={isSelected}
          object={object}
          field={field}
          frame={currentFrame}
        />
      ));
    },
  );

  const zoomAndPaneSelected = toolType === ToolType.ZOOM_AND_PANE;
  const {
    scale,
    position,
    callbacks,
    onReset,
    onZoomIn,
    onZoomOut,
  } = useZoomAndPane(zoomAndPaneSelected);

  return (
    <div>
      <ToolsHeader
        onResetClicked={onReset}
        onZoomInClicked={onZoomIn}
        onZoomOutlicked={onZoomOut}
      />
      <Stage {...callbacks}>
        <Container
          scale={scale}
          x={position.x}
          y={position.y}
          interactive={true}
          pointermove={event =>
            pushPoint(
              event.data.getLocalPosition(
                event.currentTarget,
                event.data.global,
              ),
              currentFrame,
            )
          }
          pointerdown={event =>
            acceptPoint(
              event.data.getLocalPosition(
                event.currentTarget,
                event.data.global,
              ),
              event.data.button === MouseButton.MIDDLE,
              currentFrame,
            )
          }
        >
          <Sprite
            texture={PIXI.Texture.from(document.filename)}
            ref={element => {
              const newResource: any = element?.texture.baseTexture.resource;
              if (!newResource) return;

              newResource.source.currentTime = currentFrame / fps;
              newResource.source.onseeked = () => element?.texture.update();
              newResource.autoPlay = false;

              const durationSeconds = newResource.source.duration;
              if (durationSeconds && !Number.isNaN(durationSeconds)) {
                const framesDuration = Math.floor(durationSeconds * fps);
                if (framesDuration !== duration) setDuration(framesDuration);
              }
            }}
          />
          <Text
            text="Hello World"
            x={0}
            y={0}
            style={{
              stroke: "white",
              fill: "white",
            }}
          />
          {finishedObjects}
          {drawingSchema &&
            drawingTool.object &&
            drawingStage &&
            drawingValue && (
              <PixiInProgressObject
                fieldSchema={drawingSchema}
                object={drawingTool.object}
                stage={drawingStage}
                value={drawingValue}
              />
            )}
        </Container>
      </Stage>
    </div>
  );
}
