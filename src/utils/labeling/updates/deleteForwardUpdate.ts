import { FieldValue } from "../../editors/types";
import { ExtendedLabeling } from "../types";

export default function deleteForwardUpdate(
  data: ExtendedLabeling,
  ids: string[],
  currentFrame: number,
): ExtendedLabeling {
  return {
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
            const entry = Object.entries(field.values)[0];
            const [key, values]: [
              string,
              FieldValue<any>[] | undefined,
            ] = entry;
            if (!values) return field;
            return {
              ...field,
              values: {
                [key]: values.filter(value => value.frame <= currentFrame),
              },
            };
          }),
        },
      ];
    }),
  };
}
