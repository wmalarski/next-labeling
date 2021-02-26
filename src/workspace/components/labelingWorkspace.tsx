import Typography from "@material-ui/core/Typography";
import React from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import { useSelector } from "react-redux";
import "../../../node_modules/react-grid-layout/css/styles.css";
import "../../../node_modules/react-resizable/css/styles.css";
import usePreferences from "../hooks/usePreferencesContext";
import { initialDocumentSelector } from "../redux/selectors";
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
  const doc = useSelector(initialDocumentSelector);
  const { preferences, setPreferences } = usePreferences();
  const { views } = preferences;

  return (
    <div>
      <div style={{ flexGrow: 1 }}>
        <Typography variant="h5">{doc.name}</Typography>
        <Typography variant="subtitle2">{doc.filename}</Typography>
      </div>
      <ReactGridLayout
        className="layout"
        layout={views}
        cols={12}
        rowHeight={100}
        onLayoutChange={layout =>
          setPreferences({
            ...preferences,
            views: updateViews(views, layout),
          })
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
