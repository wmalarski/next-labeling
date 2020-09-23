import { Sprite, Stage, Text, Container } from "@inlet/react-pixi";
import * as PIXI from "pixi.js";
import React, { useContext, useState } from "react";

import FramesContext from "../../contexts/frames/framesContext";
import LabelingContext from "../../contexts/labeling/labelingContext";

export interface ScaleState {
  dragStart?: {
    x: number;
    y: number;
  };
  scale: {
    x: number;
    y: number;
  };
  position: {
    x: number;
    y: number;
  };
}

export default function MainStage(): JSX.Element {
  const { document } = useContext(LabelingContext);
  const { currentFrame, duration, setDuration } = useContext(FramesContext);
  const fps = document.fps ?? 24;

  const [state, setState] = useState<ScaleState>({
    scale: { x: 1, y: 1 },
    position: { x: 1, y: 1 },
  });

  return (
    <Stage
      onWheel={event => {
        const localX = event.clientX - event.currentTarget.offsetLeft;
        const localY = event.clientY - event.currentTarget.offsetTop;
        const direction = event.deltaY < 0 ? 1 : -1;
        const factor = 1 + direction * 0.1;

        setState({
          ...state,
          scale: {
            x: state.scale.x * factor,
            y: state.scale.y * factor,
          },
          position: {
            x: (state.position.x - localX) * factor + localX,
            y: (state.position.y - localY) * factor + localY,
          },
        });
      }}
      onMouseDown={event => {
        setState({
          ...state,
          dragStart: { x: event.clientX, y: event.clientY },
        });
      }}
      onMouseMove={event => {
        if (!state.dragStart) return;
        const dx = event.clientX - state.dragStart.x;
        const dy = event.clientY - state.dragStart.y;
        setState({
          ...state,
          position: {
            x: state.position.x + dx,
            y: state.position.y + dy,
          },
          dragStart: {
            x: event.clientX,
            y: event.clientY,
          },
        });
      }}
      onMouseLeave={() => {
        setState({
          ...state,
          dragStart: undefined,
        });
      }}
      onMouseOut={() => {
        setState({
          ...state,
          dragStart: undefined,
        });
      }}
      onMouseUp={() => {
        setState({
          ...state,
          dragStart: undefined,
        });
      }}
    >
      <Container scale={state.scale} x={state.position.x} y={state.position.y}>
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
