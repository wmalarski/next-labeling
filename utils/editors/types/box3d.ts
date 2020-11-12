import * as t from "io-ts";
export const Box3dValue = t.strict({
  front: t.tuple([t.number, t.number, t.number, t.number]),
  side: t.union([t.tuple([t.number, t.number, t.number]), t.null]),
  sideType: t.union([t.literal("Left"), t.literal("Right"), t.null]),
});
export const Box3dValues = t.array(
  t.strict({
    frame: t.number,
    value: Box3dValue,
  }),
);
export const Box3dAttributes = t.strict({
  default: Box3dValue,
  color: t.string,
});
export const Box3dPositions = t.union([
  t.literal("TOP"),
  t.literal("BOTTOM"),
  t.literal("LEFT"),
  t.literal("RIGHT"),
]);
export type Box3dValue = t.TypeOf<typeof Box3dValue>;
export type Box3dValues = t.TypeOf<typeof Box3dValues>;
export type Box3dAttributes = t.TypeOf<typeof Box3dAttributes>;
export type Box3dPositions = t.TypeOf<typeof Box3dPositions>;
