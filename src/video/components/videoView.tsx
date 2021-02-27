import Konva from "konva";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Image } from "react-konva";
import { useSelector } from "react-redux";
import { useRootDispatch } from "../../common/redux/store";
import { initialDocumentSelector } from "../../workspace/redux/selectors/common-selectors";
import { currentFrameSelector } from "../../workspace/redux/selectors/doc-selectors";
import { setDuration } from "../../workspace/redux/slice";

export interface VideoViewProps {
  onClick: () => void;
}

export default function VideoView(props: VideoViewProps): JSX.Element {
  const { onClick } = props;

  const dispatch = useRootDispatch();
  const currentFrame = useSelector(currentFrameSelector);
  const initial = useSelector(initialDocumentSelector);
  const { filename: source, fps = 24 } = initial;

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
      videoElement.currentTime = 0;

      const durationSeconds = videoElement.duration;
      const framesDuration = Math.floor(durationSeconds * fps);
      dispatch(setDuration(framesDuration));
    };
    videoElement.addEventListener("loadedmetadata", onload);
    return () => {
      videoElement.removeEventListener("loadedmetadata", onload);
    };
  }, [dispatch, fps, videoElement]);

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
      x={0}
      y={0}
      width={size.width}
      height={size.height}
      onClick={onClick}
    />
  );
}
