import range from "lodash/range";
import Konva from "konva";

// https://gist.github.com/renancouto/4675192
function lightenColor(color: string, percent: number): string {
  const num = parseInt(color.replace("#", ""), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    B = ((num >> 8) & 0x00ff) + amt,
    G = (num & 0x0000ff) + amt;

  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
      (G < 255 ? (G < 1 ? 0 : G) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

const selected = ["#3d21de", "#943540", "#0180f5", "#0dac9d"];

export const darkerTimelineColors = [
  ...selected,
  ...range(0, 100).map(() => Konva.Util.getRandomColor()),
];
export const lighterColors = darkerTimelineColors.map(color =>
  lightenColor(color, 20),
);
