import Konva from "konva";
import React, { RefObject } from "react";
import { Label, Tag, Text } from "react-konva";
import { FontSize } from "../../utils/video/constansts";

export interface TooltipLabelProps {
  labelRef: RefObject<Konva.Label>;
  textRef: RefObject<Konva.Text>;
  text?: string;
  opacity?: number;
  fontSize?: number;
}

export function TooltipLabel(props: TooltipLabelProps): JSX.Element | null {
  const { labelRef, textRef, text, opacity = 0.5, fontSize = FontSize } = props;

  return (
    <Label ref={labelRef} visible={false} opacity={opacity}>
      <Tag
        fill="black"
        pointerDirection="down"
        pointerWidth={10}
        pointerHeight={10}
      />
      <Text
        ref={textRef}
        text={text}
        fill="white"
        fontSize={fontSize}
        padding={5}
      />
    </Label>
  );
}
