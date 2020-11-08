import Konva from "konva";
import React, { useRef } from "react";
import { Group, Label, Tag, Text } from "react-konva";
import { FontSize } from "../../../utils/visualization/constanst";
import { getEventRelativePosition } from "../../../utils/visualization/functions";

export interface BoxLeafProps {
  text: string;
  opacity?: number;
  children: JSX.Element | JSX.Element[];
}

export function HoverTooltip(props: BoxLeafProps): JSX.Element | null {
  const { text, opacity = 0.5, children } = props;
  const labelRef = useRef<Konva.Label>(null);

  return (
    <>
      <Group
        onMouseMove={event => {
          const label = labelRef.current;
          const mousePos = getEventRelativePosition(event);
          if (!label || !mousePos) return;

          label.position(mousePos);
          label.show();
          label.getLayer()?.batchDraw();
        }}
        onMouseOut={() => {
          labelRef.current?.hide();
          labelRef.current?.getLayer()?.draw();
        }}
        onMouseLeave={() => {
          labelRef.current?.hide();
          labelRef.current?.getLayer()?.draw();
        }}
      >
        {children}
      </Group>
      <Label ref={labelRef} visible={false} opacity={opacity}>
        <Tag
          fill="black"
          pointerDirection="down"
          pointerWidth={10}
          pointerHeight={10}
        />
        <Text fill="white" text={text} fontSize={FontSize} padding={5} />
      </Label>
    </>
  );
}
