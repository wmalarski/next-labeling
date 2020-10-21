import { unpackValues } from "./functions";
import {
  FieldType,
  LabelingFieldAttributes,
  LabelingFieldValues,
} from "./types";

export default function getValueIndex(
  values: LabelingFieldValues,
  attributes: LabelingFieldAttributes,
): number {
  const unpacked = unpackValues(values);
  if (!unpacked) return 0;
  const { type, pairs } = unpacked;
  const value = pairs[0].value;
  if (!value) return 0;

  switch (type) {
    case FieldType.LINE:
    case FieldType.POINT:
    case FieldType.POLYGON:
    case FieldType.RECTANGLE:
    case FieldType.BOX3D:
    case FieldType.EYE:
    case FieldType.GRAPH:
      return 0;
    case FieldType.CHECKBOX:
      return value === true ? 1 : 0;
    case FieldType.TEXT:
      return 0;
    case FieldType.NUMERIC: {
      const numeric = attributes.Numeric;
      if (!numeric) return 0;
      return Math.floor(
        (100 * (value - numeric.min)) / (numeric.max - numeric.min),
      );
    }
    case FieldType.COMBOBOX:
      return attributes.ComboBox?.options.indexOf(value) ?? 0;
    case FieldType.SELECT:
      return (
        attributes.Select?.options.map(option => option.text).indexOf(value) ??
        0
      );
    case FieldType.MULSELECT:
      return (
        attributes.MultiSelect?.options
          .flatMap((option, index) => {
            if (!value.includes(option.text)) return [];
            return [Math.pow(2, index)];
          })
          .reduce((a, b) => a + b) ?? 0
      );
    default:
      return 0;
  }
}
