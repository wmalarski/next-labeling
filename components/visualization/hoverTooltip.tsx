import React from "react";
import { Group } from "react-konva";
import { useTooltipLabel } from "../../utils/visualization/hooks/useTooltipLabel";
import { TooltipLabel } from "./tooltipLabel";

export interface BoxLeafProps {
  text: string;
  opacity?: number;
  children: JSX.Element | JSX.Element[];
}

export function HoverTooltip(props: BoxLeafProps): JSX.Element | null {
  const { text, opacity = 0.5, children } = props;

  const {
    labelRef,
    textRef,
    onMouseLeave,
    onMouseMove,
    onMouseOut,
  } = useTooltipLabel();

  return (
    <>
      <Group
        onMouseMove={onMouseMove}
        onMouseOut={onMouseOut}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </Group>
      <TooltipLabel
        labelRef={labelRef}
        textRef={textRef}
        opacity={opacity}
        text={text}
      />
    </>
  );
}
