import { UnpackedFrameValuePair, unpackValues } from "../editors/functions";
import getValueIndex from "../editors/indexes";
import { LabelingField, LabelingObject } from "../workspace/types/client";
import { FieldBlock, ObjectBlock, TimelineObjectConfig } from "./types";

interface ReduceFieldBlocksState {
  fieldBlocks: FieldBlock[];
  objectBlocks: ObjectBlock[];
}

export function calculateObjectBlocks(
  object: LabelingObject,
  duration: number,
): ObjectBlock[] {
  if (object.objectSchema.singleton || !object.frames) {
    return [{ firstFrame: 0, lastFrame: duration }];
  }

  const [first, ...frames] = object.frames.sort((a, b) => a - b);
  return frames
    .reduce(
      (prev, curr, index, array) => {
        const next = array[index + 1];
        if (!next) return [...prev, curr];
        return curr + 1 === next ? prev : [...prev, curr, next];
      },
      [first],
    )
    .reduce<ObjectBlock[]>((prev, current, index, array) => {
      return index % 2 === 0
        ? [
            ...prev,
            { firstFrame: current, lastFrame: array[index + 1] ?? current },
          ]
        : prev;
    }, []);
}

export function calculateFieldBlocks(
  field: LabelingField,
  objectBlocks: ObjectBlock[],
  duration: number,
): FieldBlock[] {
  const attributes = field.fieldSchema.attributes;

  const unpacked = unpackValues(field.values);
  if (!unpacked)
    return [{ firstFrame: 0, lastFrame: duration, index: 0, value: "" }];
  const { type, pairs } = unpacked;

  const res = pairs.reduce<UnpackedFrameValuePair[][]>(
    (prev, curr, index, array) => [...prev, [curr, array[index + 1]]],
    [],
  );
  const result = res.reduce<ReduceFieldBlocksState>(
    (prev, curr) => {
      const [left, right] = curr;
      const [currentBlock, ...otherBlocks] = prev.objectBlocks;
      const rightFrame = right ? right.frame : currentBlock.lastFrame;
      const index = getValueIndex({ [type]: [left] }, attributes);
      if (rightFrame <= currentBlock.lastFrame) {
        return {
          objectBlocks: prev.objectBlocks,
          fieldBlocks: [
            ...prev.fieldBlocks,
            {
              firstFrame: left.frame,
              lastFrame: rightFrame,
              value: `${left.value}`,
              index,
            },
          ],
        };
      }
      // TODO: test this part - multiple blocks #11
      const [nextBlock] = otherBlocks;
      return {
        objectBlocks: otherBlocks,
        fieldBlocks: [
          ...prev.fieldBlocks,
          {
            firstFrame: left.frame,
            lastFrame: currentBlock.lastFrame,
            value: `${left.value}`,

            index,
          },
          {
            firstFrame: nextBlock.firstFrame,
            lastFrame: right.frame,
            value: `${left.value}`,
            index,
          },
        ],
      };
    },
    {
      fieldBlocks: [],
      objectBlocks,
    },
  );

  return [...result.fieldBlocks];
}

export function getTimelineObjectConfigs(
  objects: LabelingObject[],
  toggled: string[],
  duration: number,
): TimelineObjectConfig[] {
  return objects.reduce<TimelineObjectConfig[]>((prev, object) => {
    const last = prev[prev.length - 1] ?? { row: -1, fieldBlocks: [] };
    const row = last.row + last.fieldBlocks.length + 1;
    const objectBlocks = calculateObjectBlocks(object, duration);
    const isToggled = toggled.includes(object.id);
    const visibleFields = isToggled ? object.fields : [];
    const fieldBlocks = visibleFields.map(field => ({
      field,
      fieldBlocks: calculateFieldBlocks(field, objectBlocks, duration),
    }));
    return [...prev, { row, object, objectBlocks, fieldBlocks, isToggled }];
  }, []);
}
