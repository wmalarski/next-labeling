import React, { useState } from "react";
import { Rect } from "react-konva";
import { BoxLeafWidth, HoverFill, HoverOpacity } from "../../constants";

export interface BoxLeafProps {
  x: number;
  y: number;
  height: number;
  isLeft: boolean;
  onClick: () => void;
}

export function BoxLeaf(props: BoxLeafProps): JSX.Element | null {
  const { x, y, height, isLeft, onClick } = props;
  const [isHover, setIsHover] = useState(false);

  return (
    <Rect
      x={x - (isLeft ? BoxLeafWidth : 1)}
      y={y}
      height={height}
      width={BoxLeafWidth}
      fill={HoverFill}
      opacity={isHover ? HoverOpacity : 0}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onMouseOut={() => setIsHover(false)}
      onClick={onClick}
      onTap={onClick}
    />
  );
}
