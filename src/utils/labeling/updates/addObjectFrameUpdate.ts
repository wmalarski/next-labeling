import { ExtendedLabeling } from "../types";

export default function addObjectFrameUpdate(
  data: ExtendedLabeling,
  currentFrame: number,
  changeValue: number,
): { result: ExtendedLabeling; tracked: boolean } {
  const nextFrame = currentFrame + changeValue;
  // TODO: return idexes of items that was tracked #1
  const pairs = data.objects.map(object => {
    if (
      !object.isTracked ||
      object.isDone ||
      !object.frames ||
      !object.frames.includes(currentFrame) ||
      object.frames.includes(nextFrame)
    )
      return { object, tracked: false };

    return {
      object: {
        ...object,
        frames: [...object.frames, nextFrame],
        fields: object.fields.map(field => {
          if (!field.fieldSchema.perFrame) return field;
          // TODO: vision tracking #12
          if (changeValue === 1) return field;

          // move first frame
          const entry = Object.entries(field.values)[0];
          const [key, values] = entry;
          if (!values) return field;
          const [firstValue, ...other] = values;

          return {
            ...field,
            values: {
              [key]: [
                {
                  ...firstValue,
                  frame: nextFrame,
                },
                ...other,
              ],
            },
          };
        }),
      },
      tracked: true,
    };
  });

  return {
    result: { ...data, objects: pairs.map(pair => pair.object) },
    tracked: pairs.filter(pair => pair.tracked).length > 0,
  };
}
