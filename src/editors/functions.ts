import { LabelingDirection } from "../workspace/contexts/preferencesContext";
import { FieldType, LabelingFieldValues } from "./types";

export interface UnpackedFrameValuePair {
  frame: number;
  value: any;
}

export interface UnpackedFrameValues {
  pairs: UnpackedFrameValuePair[];
  type: FieldType;
}

export function unpackValues(
  values: LabelingFieldValues,
): UnpackedFrameValues | undefined {
  const entry = Object.entries(values ?? {})[0];
  if (!entry) return;
  const [type, unknownValues] = entry;
  if (!unknownValues) return;
  return {
    pairs: unknownValues,
    type: type as FieldType,
  };
}

export interface GetFieldValueProps {
  perFrame: boolean;
  frame: number;
  values: LabelingFieldValues;
}

export function getFieldValues(
  props: GetFieldValueProps,
): LabelingFieldValues | undefined {
  const { perFrame, frame, values } = props;

  const unpacked = unpackValues(values);
  if (!unpacked) return;
  const { type, pairs } = unpacked;

  if (perFrame) {
    return {
      [type]: [
        pairs.find((frameObject, index, obj) => {
          const nextFrameObject = obj[index + 1];
          if (!nextFrameObject) return true;
          return frameObject.frame <= frame && frame < nextFrameObject.frame;
        }),
      ],
    };
  } else if (!perFrame) {
    return { [type]: [{ frame: 0, value: pairs[0].value }] };
  }
}

export function calculateNewValues(
  values: LabelingFieldValues,
  perFrame: boolean,
  newValue: LabelingFieldValues,
  direction: LabelingDirection,
): LabelingFieldValues {
  if (direction !== LabelingDirection.FORWARD) return values; // TODO: #20

  const unpackedValues = unpackValues(values);
  const unpackedNewValue = unpackValues(newValue);
  if (!unpackedValues || !unpackedNewValue) return values;

  const type = unpackedNewValue.type;
  const newPair = unpackedNewValue.pairs[0];
  const { value, frame } = newPair;

  if (!perFrame) return { [type]: [{ frame: 0, value }] };

  const newValues = [...unpackedValues.pairs];
  const firstBiggerIndex = newValues.findIndex(pair => pair.frame > frame);

  if (firstBiggerIndex !== -1) {
    const firstBigger = newValues[firstBiggerIndex];
    if (
      firstBigger &&
      JSON.stringify(firstBigger.value) === JSON.stringify(value)
    ) {
      newValues.splice(firstBiggerIndex, 1);
    }
  }

  const firstIndex =
    firstBiggerIndex === -1 ? newValues.length - 1 : firstBiggerIndex - 1;
  const firstLower = newValues[firstIndex];
  const secondLower = newValues[firstIndex - 1];

  if (
    secondLower &&
    JSON.stringify(secondLower.value) === JSON.stringify(value)
  ) {
    if (firstLower.frame === frame) {
      newValues.splice(firstIndex, 1);
    }
  } else {
    if (firstLower.frame === frame) {
      newValues.splice(firstIndex, 1, newPair);
    } else {
      newValues.splice(firstIndex + 1, 0, newPair);
    }
  }
  return { [type]: newValues };
}
