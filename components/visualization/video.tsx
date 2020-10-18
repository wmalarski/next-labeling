import Konva from "konva";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Image } from "react-konva";

import { LabelingContextValue } from "../../utils/labeling/contexts/labelingContext";

export interface VideoProps {
  context: LabelingContextValue;
}

export default function Video(props: VideoProps): JSX.Element {
  const { context } = props;

  const { document: labelingDocument, history, setDuration } = context;
  const { currentFrame } = history.data;
  const source = labelingDocument.filename;
  const fps = labelingDocument.fps ?? 24;

  const imageRef = useRef<Konva.Image | null>(null);
  const [size, setSize] = useState({ width: 50, height: 50 });

  const videoElement = useMemo(() => {
    const element = document.createElement("video");
    element.autoplay = false;
    element.src = source;
    return element;
  }, [source]);

  useEffect(() => {
    const onload = () => {
      setSize({
        width: videoElement.videoWidth,
        height: videoElement.videoHeight,
      });
      const durationSeconds = videoElement.duration;
      const framesDuration = Math.floor(durationSeconds * fps);
      setDuration(framesDuration);
    };
    videoElement.addEventListener("loadedmetadata", onload);
    return () => {
      videoElement.removeEventListener("loadedmetadata", onload);
    };
  }, [fps, setDuration, videoElement]);

  // use Konva.Animation to redraw a layer
  useEffect(() => {
    if (!imageRef.current) return;

    const layer = imageRef.current.getLayer();
    const anim = new Konva.Animation(() => void 0, layer);

    anim.start();
    return () => {
      anim.stop();
    };
  }, [videoElement]);

  useEffect(() => {
    videoElement.currentTime = currentFrame / fps;
  }, [currentFrame, fps, videoElement]);

  return (
    <Image
      ref={imageRef}
      image={videoElement}
      x={20}
      y={20}
      width={size.width}
      height={size.height}
      draggable
    />
  );
}
