import Typography from "@material-ui/core/Typography";
import React from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import { useSelector } from "react-redux";
import "../../../node_modules/react-grid-layout/css/styles.css";
import "../../../node_modules/react-resizable/css/styles.css";
import { useRootDispatch } from "../../common/redux/store";
import { initialDocumentSelector } from "../redux/selectors/common-selectors";
import { labelingViewsSelector } from "../redux/selectors/preferences-selectors";
import { setPreferences } from "../redux/slice";
import { updateViews } from "../views";
import LabelingViewItem from "./labelingViewItem";

const ReactGridLayout = WidthProvider(RGL);

export interface LabelingWorkspaceProps {
  documentId: string;
}

export default function LabelingWorkspace(
  props: LabelingWorkspaceProps,
): JSX.Element {
  const { documentId } = props;

  const dispatch = useRootDispatch();
  const initial = useSelector(initialDocumentSelector);
  const views = useSelector(labelingViewsSelector);

  return (
    <div>
      <div style={{ flexGrow: 1 }}>
        <Typography variant="h5">{initial.name}</Typography>
        <Typography variant="subtitle2">{initial.filename}</Typography>
      </div>
      <ReactGridLayout
        className="layout"
        layout={views}
        cols={12}
        rowHeight={100}
        onLayoutChange={layout =>
          dispatch(
            setPreferences({
              views: updateViews(views, layout),
            }),
          )
        }
      >
        {views.map(view => (
          <div key={view.i}>
            <LabelingViewItem documentId={documentId} view={view} />
          </div>
        ))}
      </ReactGridLayout>
    </div>
  );
}
