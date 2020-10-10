import { FieldValue } from "../../editors/types";
import { ExtendedLabeling } from "../types";
import { LabelingState } from "../useLabelingHistory";

export default function deleteBackwardUpdate(
  data: ExtendedLabeling,
  ids: string[],
  currentFrame: number,
): LabelingState {
  return {
    message: "Objects deleted forward",
    data: {
      ...data,
      objects: data.objects.flatMap(object => {
        if (!ids.includes(object.id)) return [object];

        const frames =
          object.frames?.filter(frame => frame >= currentFrame) ?? null;
        if (frames?.length === 0) return [];

        return [
          {
            ...object,
            frames,
            fields: object.fields.map(field => {
              const entry = Object.entries(field.values)[0];
              const [key, values] = entry;
              if (!values) return field;

              const newValues: FieldValue<any>[] = [...values];
              const lower = newValues.filter(
                value => value.frame < currentFrame,
              );
              newValues.splice(0, lower.length);

              const firstGreater = newValues[0];
              if (
                (firstGreater && firstGreater.frame !== currentFrame) ||
                !firstGreater
              ) {
                newValues.splice(0, 0, {
                  frame: currentFrame,
                  value: lower[lower.length - 1].value,
                });
              }
              return {
                ...field,
                values: { [key]: newValues },
              };
            }),
          },
        ];
      }),
    },
  };
}
