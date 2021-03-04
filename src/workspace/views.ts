import FilterIcon from "@material-ui/icons/Filter";
import Filter1Icon from "@material-ui/icons/Filter1";
import Filter2Icon from "@material-ui/icons/Filter2";
import Filter3Icon from "@material-ui/icons/Filter3";
import Filter4Icon from "@material-ui/icons/Filter4";
import Filter5Icon from "@material-ui/icons/Filter5";
import Filter6Icon from "@material-ui/icons/Filter6";
import Filter7Icon from "@material-ui/icons/Filter7";
import Filter8Icon from "@material-ui/icons/Filter8";
import Filter9Icon from "@material-ui/icons/Filter9";
import reject from "lodash/reject";
import GridLayout from "react-grid-layout";

export enum LabelingView {
  TIMELINE = "TIMELINE",
  PROPERTIES = "PROPERTIES",
  COMMENTS = "COMMENTS",
  VIDEO = "VIDEO",
  SLIDER = "SLIDER",
}

export type LabelingViews = GridLayout.Layout[];

export const defaultLabelingViews: LabelingViews = [
  {
    i: LabelingView.VIDEO,
    x: 0,
    y: 0,
    w: 10,
    h: 5,
    static: true,
  },
  {
    i: LabelingView.TIMELINE,
    x: 0,
    y: 5,
    w: 12,
    h: 4,
    static: true,
  },
  {
    i: LabelingView.PROPERTIES,
    x: 10,
    y: 0,
    w: 2,
    h: 5,
    static: true,
  },
  {
    i: LabelingView.SLIDER,
    x: 0,
    y: 9,
    w: 12,
    h: 2,
    static: true,
  },
];

export const DefaultViewHeight = 2;
export const DefaultViewWidth = 2;
export const DefaultViewX = 0;
export const DefaultViewY = Infinity;

export function addNewView(
  views: LabelingViews,
  key: string,
  options?: Partial<GridLayout.Layout>,
): LabelingViews {
  const layout = options ?? {};
  return [
    ...views,
    {
      x: DefaultViewX,
      y: DefaultViewY,
      h: DefaultViewHeight,
      w: DefaultViewWidth,
      ...layout,
      i: key,
    },
  ];
}

export function isViewVisible(views: LabelingViews, key: string): boolean {
  return views.some(layout => layout.i === key);
}

export function getDefaultView(key: string): GridLayout.Layout | undefined {
  return defaultLabelingViews.find(layout => layout.i === key);
}

export function toggleView(views: LabelingViews, key: string): LabelingViews {
  const index = views.findIndex(layout => layout.i === key);
  if (index === -1) return addNewView(views, key, getDefaultView(key) ?? {});
  return reject(views, { i: key });
}

export function updateView(
  views: LabelingViews,
  key: string,
  options?: Partial<GridLayout.Layout>,
): LabelingViews {
  return views.map(view => (view.i === key ? { ...view, ...options } : view));
}

export function updateViews(
  views: LabelingViews,
  layouts: GridLayout.Layout[],
): LabelingViews {
  return views.map(view => ({
    ...view,
    ...(layouts.find(layout => layout.i === view.i) ?? {}),
  }));
}

export const filterIcons = [
  Filter1Icon,
  Filter2Icon,
  Filter3Icon,
  Filter4Icon,
  Filter5Icon,
  Filter6Icon,
  Filter7Icon,
  Filter8Icon,
  Filter9Icon,
  FilterIcon,
];
