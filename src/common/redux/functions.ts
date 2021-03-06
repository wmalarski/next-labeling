import { nanoid } from "@reduxjs/toolkit";
import { SnapshotPrepareAction } from "./types";

export function snapshotPrepare<P = void>(
  payload: P,
): SnapshotPrepareAction<P> {
  return {
    payload,
    meta: { snapshotId: nanoid() },
  };
}
