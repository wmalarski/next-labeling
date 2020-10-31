import Konva from "konva";
import React, { useEffect, useRef } from "react";
import { Rect, Text, Transformer } from "react-konva";
import { LabelingObject } from "../../../utils/labeling/types/client";
import { FontSize } from "../../../utils/visualization/constanst";
import { getShapeStyle } from "../../../utils/visualization/functions";

export interface RectangleShapeProps {
  x: number;
  y: number;
  width: number;
  height: number;
  stroke?: string;
}

export function updateTextProps(
  text: React.RefObject<Konva.Text>,
  rect: RectangleShapeProps,
): void {
  const node = text.current;
  node?.x(rect.x);
  node?.y(rect.y);
  node?.width(rect.width);
  node?.getLayer()?.batchDraw();
}

export interface RectangleProps {
  isSelected: boolean;
  object: LabelingObject;
  rectProps: RectangleShapeProps;
  onSelect: (id: string, reset: boolean) => void;
  onChange: (value: RectangleShapeProps) => void;
  onMove?: (value: RectangleShapeProps) => void;
}

export function Rectangle(props: RectangleProps): JSX.Element | null {
  const { rectProps, isSelected, object, onSelect, onChange, onMove } = props;
  const { isDone, name } = object;
  const draggable = !isDone && isSelected;

  const textRef = useRef<Konva.Text>(null);
  const rectRef = useRef<Konva.Rect>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (!isSelected || !trRef.current || !rectRef.current) return;
    trRef.current.nodes([rectRef.current]);
    trRef.current.getLayer()?.batchDraw();
  }, [isSelected]);

  return (
    <>
      <Text
        ref={textRef}
        x={rectProps.x}
        y={rectProps.y}
        text={name}
        width={rectProps.width}
        align="center"
        fill={rectProps.stroke}
        fontSize={FontSize}
      />
      <Rect
        ref={rectRef}
        {...rectProps}
        {...getShapeStyle(isSelected)}
        draggable={draggable}
        onClick={event => onSelect(object.id, !event.evt.ctrlKey)}
        onTap={() => onSelect(object.id, true)}
        onDragMove={e => {
          const newProps = {
            ...rectProps,
            x: e.target.x(),
            y: e.target.y(),
            width: e.target.width(),
            height: e.target.height(),
          };
          updateTextProps(textRef, newProps);
          onMove?.(newProps);
        }}
        onDragEnd={e => {
          const node = e.target;
          const x = node.x();
          const y = node.y();
          onChange({ ...rectProps, x, y });
        }}
        onTransform={e => {
          const newProps = {
            x: e.target.x(),
            y: e.target.y(),
            width: e.target.width() * e.target.scaleX(),
            height: e.target.height() * e.target.scaleY(),
          };
          updateTextProps(textRef, newProps);
          onMove?.(newProps);
        }}
        onTransformEnd={() => {
          const node = rectRef.current;
          if (!node) return;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);

          const x = node.x();
          const y = node.y();
          const width = Math.max(5, node.width() * scaleX);
          const height = Math.max(5, node.height() * scaleY);
          onChange({ ...rectProps, x, y, width, height });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={false}
          keepRatio={false}
          resizeEnabled={!isDone}
          boundBoxFunc={(oldBox, newBox) =>
            newBox.width < 5 || newBox.height < 5 ? oldBox : newBox
          }
        />
      )}
    </>
  );
}
