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

  const { refs, onMouseLeave, onMouseMove } = useTooltipLabel({});

  return (
    <>
      <Group
        onMouseMove={onMouseMove}
        onMouseOut={onMouseLeave}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </Group>
      <TooltipLabel refs={refs} opacity={opacity} text={text} />
    </>
  );
}
