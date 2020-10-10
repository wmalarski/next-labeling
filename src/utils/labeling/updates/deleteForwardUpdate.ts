import { ExtendedLabeling } from "../types";
import { LabelingState } from "../hooks/useLabelingHistory";
import { unpackValues } from "../../editors/functions";

export default function deleteForwardUpdate(
  data: ExtendedLabeling,
): LabelingState {
  const currentFrame = data.currentFrame;
  const ids = data.selected
    .filter(object => object.objectSelected)
    .map(object => object.objectId);
  return {
    message: "Objects deleted forward",
    data: {
      ...data,
      objects: data.objects.flatMap(object => {
        if (!ids.includes(object.id)) return [object];

        const frames =
          object.frames?.filter(frame => frame <= currentFrame) ?? null;
        if (frames?.length === 0) return [];

        return [
          {
            ...object,
            frames,
            fields: object.fields.map(field => {
              const unpacked = unpackValues(field.values);
              if (!unpacked) return field;
              const { type, pairs } = unpacked;
              return {
                ...field,
                values: {
                  [type]: pairs.filter(value => value.frame <= currentFrame),
                },
              };
            }),
          },
        ];
      }),
    },
  };
}
