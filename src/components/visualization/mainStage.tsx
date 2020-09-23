import { Sprite, Stage, Text, Container } from "@inlet/react-pixi";
import * as PIXI from "pixi.js";
import React, { useContext } from "react";

import FramesContext from "../../contexts/frames/framesContext";
import LabelingContext from "../../contexts/labeling/labelingContext";
import useZoomAndPane from "../../utils/vizualization/useZoomAndPane";

export default function MainStage(): JSX.Element {
  const { document } = useContext(LabelingContext);
  const { currentFrame, duration, setDuration } = useContext(FramesContext);
  const fps = document.fps ?? 24;

  const enabled = true;
  const { scale, position, callbacks } = useZoomAndPane(enabled);

  return (
    <Stage {...callbacks}>
      <Container scale={scale} x={position.x} y={position.y}>
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
  );
}
