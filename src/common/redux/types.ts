import { PayloadAction } from "@reduxjs/toolkit";

export type SnapshotId = { snapshotId: string };

export type SnapshotPayloadAction<
  P = void,
  T extends string = string,
  M extends SnapshotId = SnapshotId,
  E = never
> = PayloadAction<P, T, M, E>;

export type SnapshotPrepareAction<
  P = void,
  M extends SnapshotId = SnapshotId,
  E = never
> = {
  payload: P;
} & ([M] extends [never]
  ? {}
  : {
      meta: M;
    }) &
  ([E] extends [never]
    ? {}
    : {
        error: E;
      });
