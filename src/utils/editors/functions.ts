import { FieldEditorProps, FieldValue, LabelingFieldValues } from "./types";

export function getFieldValue<T extends keyof LabelingFieldValues>(
  props: FieldEditorProps<T>,
): FieldValue<T> | undefined {
  const { perFrame, frame, values: valuesObject } = props;
  const unknownValues = Object.values(valuesObject ?? {})[0];
  if (!unknownValues) return;
  const values = unknownValues as FieldValue<T>[];

  if (perFrame) {
    return values.find((frameObject, index, obj) => {
      const nextFrameObject = obj[index + 1];
      if (!nextFrameObject) return true;
      return frameObject.frame <= frame && frame < nextFrameObject.frame;
    });
  } else if (!perFrame) {
    return { frame: -1, value: values[0].value };
  }
}

export function calculateNewValues<T extends keyof LabelingFieldValues>(
  values: LabelingFieldValues[T],
  perFrame: boolean,
  fieldValue: FieldValue<any>,
): LabelingFieldValues[T] {
  if (!fieldValue || !values) return values;
  if (perFrame) {
    const emptyValues: FieldValue<any>[] = [];
    const newValues = [...(values ?? emptyValues)];
    const firstBiggerIndex = newValues.findIndex(
      pair => pair.frame > fieldValue.frame,
    );

    if (firstBiggerIndex !== -1) {
      const firstBigger = newValues[firstBiggerIndex];
      if (
        firstBigger &&
        JSON.stringify(firstBigger.value) === JSON.stringify(fieldValue.value)
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
      JSON.stringify(secondLower.value) === JSON.stringify(fieldValue.value)
    ) {
      if (firstLower.frame === fieldValue.frame) {
        newValues.splice(firstIndex, 1);
      }
    } else {
      if (firstLower.frame === fieldValue.frame) {
        newValues.splice(firstIndex, 1, fieldValue);
      } else {
        newValues.splice(firstIndex + 1, 0, fieldValue);
      }
    }
    return newValues;
  } else {
    return [fieldValue];
  }
}
