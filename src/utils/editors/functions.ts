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
  previousValues: LabelingFieldValues[T],
  perFrame: boolean,
  fieldValue: FieldValue<any>,
): LabelingFieldValues[T] {
  if (!fieldValue) return previousValues;
  if (perFrame) {
    // TODO: add forward labeling
    return previousValues;
  } else {
    return [
      {
        frame: -1,
        value: fieldValue.value,
      },
    ];
  }
}
