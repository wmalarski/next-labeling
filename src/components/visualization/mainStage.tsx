import { Sprite, Stage, Text, Container } from "@inlet/react-pixi";
import * as PIXI from "pixi.js";
import React, { useContext } from "react";

import FramesContext from "../../contexts/frames/framesContext";
import LabelingContext from "../../contexts/labeling/labelingContext";
import ToolContext, { ToolType } from "../../contexts/tool/toolContext";
import useObjectBuilder from "../../utils/vizualization/useObjectBuilder";
import useZoomAndPane from "../../utils/vizualization/useZoomAndPane";
import ToolsHeader from "./toolsHeader";

export default function MainStage(): JSX.Element {
  const { document, history } = useContext(LabelingContext);
  const { currentFrame, duration, setDuration } = useContext(FramesContext);
  const fps = document.fps ?? 24;

  const { toolType, objectId } = useContext(ToolContext);

  const objectBuilderSelected = !!objectId;
  const object = objectBuilderSelected
    ? history.data.objects.find(object => object.id === objectId)
    : undefined;
  const objectBuilder = useObjectBuilder(object);

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
          pointermove={event => {
            if (!objectBuilderSelected) return;
            const local = event.data.getLocalPosition(
              event.currentTarget,
              event.data.global,
            );
            if (!objectBuilder.isFinished) {
              objectBuilder.pushPoint(local);
            }
          }}
          pointerdown={() => {
            if (!objectBuilder.isFinished) {
              objectBuilder.acceptPoint(objectBuilder.canBeFinished);
            }
          }}
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
        </Container>
      </Stage>
    </div>
  );
}
