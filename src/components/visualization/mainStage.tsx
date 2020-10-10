import { Container, Sprite, Stage, Text } from "@inlet/react-pixi";
import * as PIXI from "pixi.js";
import React, { useContext, useMemo } from "react";

import LabelingContext from "../../contexts/labeling/labelingContext";
import ToolContext, { ToolType } from "../../contexts/tool/toolContext";
import getCoordsBuilders from "../../utils/vizualization/coordsBuilders";
import { MouseButton } from "../../utils/vizualization/types";
import useCoordsFactory from "../../utils/vizualization/useCoordsFactory";
import useZoomAndPane from "../../utils/vizualization/useZoomAndPane";
import ToolsHeader from "./toolsHeader";

export default function MainStage(): JSX.Element {
  const { document, history, duration, setDuration } = useContext(
    LabelingContext,
  );
  const { objects, currentFrame } = history.data;
  const fps = document.fps ?? 24;

  const { toolType, objectId } = useContext(ToolContext);

  const isBuilderInProgress = !!objectId;
  const object = isBuilderInProgress
    ? objects.find(object => object.id === objectId)
    : undefined;
  const builders = useMemo(() => getCoordsBuilders(object), [object]);
  const { acceptPoint, pushPoint, factoryState } = useCoordsFactory(
    (builders ?? [])[0],
  );
  console.log(
    JSON.stringify(factoryState.lastValue, null, 2),
    JSON.stringify(factoryState.currentValue, null, 2),
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
            )
          }
          pointerdown={event =>
            acceptPoint(
              event.data.getLocalPosition(
                event.currentTarget,
                event.data.global,
              ),
              event.data.button === MouseButton.MIDDLE,
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
          {/* {objectsInProgress.map(value =>
            value.fieldSchema && value.value ? (
              <PixiObject
                key={value.fieldSchema.id}
                canBeFinished={value.canBeFinished}
                fieldSchema={value.fieldSchema}
                isFinished={value.isFinished}
                stage={value.stage}
                value={value.value}
              />
            ) : (
              <></>
            ),
          )} */}
        </Container>
      </Stage>
    </div>
  );
}
