import head from "lodash/head";
import { DrawingTool } from "../../workspace/types/client";
import { CoordsBuilder, FieldType } from "../types";
import Box3dBuilder from "./box3dBuilder";
import EyeBuilder from "./eyeBuilder";
import GraphBuilder from "./graphBuilder";
import LineBuilder from "./lineBuilder";
import PointBuilder from "./pointBuilder";
import PolygonBuilder from "./polygonBuilder";
import RectangleBuilder from "./rectangleBuilder";

export default function getCoordsBuilders(
  drawingTool: DrawingTool | null,
): CoordsBuilder | null {
  if (!drawingTool) return null;
  const fieldType = head(Object.keys(drawingTool?.fieldSchema.attributes));

  switch (fieldType) {
    case FieldType.RECTANGLE:
      return RectangleBuilder;
    case FieldType.POINT:
      return PointBuilder;
    case FieldType.GRAPH:
      return GraphBuilder;
    case FieldType.BOX3D:
      return Box3dBuilder;
    case FieldType.EYE:
      return EyeBuilder;
    case FieldType.LINE:
      return LineBuilder;
    case FieldType.POLYGON:
      return PolygonBuilder;
    default:
      return null;
  }
}
