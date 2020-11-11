import React from "react";
import { Label, Tag, Text } from "react-konva";
import { FontSize } from "../../utils/video/constansts";
import { UseTooltipLabelRefs } from "../../utils/visualization/hooks/useTooltipLabel";

export interface TooltipLabelProps {
  refs: UseTooltipLabelRefs;
  text?: string;
  opacity?: number;
  fontSize?: number;
}

export function TooltipLabel(props: TooltipLabelProps): JSX.Element | null {
  const { refs, text, opacity = 0.5, fontSize = FontSize } = props;
  const { labelRef, textRef } = refs;

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
