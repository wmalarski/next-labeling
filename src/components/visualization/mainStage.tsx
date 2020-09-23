import React from "react";
import { Stage, Text } from "@inlet/react-pixi";

export default function MainStage(): JSX.Element {
  return (
    <Stage>
      <Text
        text="Hello World"
        x={100}
        y={100}
        style={{
          stroke: "white",
          fill: "white",
        }}
      />
    </Stage>
  );
}
