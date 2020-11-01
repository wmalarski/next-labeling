import Typography from "@material-ui/core/Typography";
import React from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import "../../node_modules/react-grid-layout/css/styles.css";
import "../../node_modules/react-resizable/css/styles.css";
import useLabelingContext from "../../utils/labeling/hooks/useLabelingContext";
import usePreferences from "../../utils/labeling/hooks/usePreferencesContext";
import { updateViews } from "../../utils/labeling/views";
import LabelingViewItem from "./labelingViewItem";

const ReactGridLayout = WidthProvider(RGL);

export interface LabelingWorkspaceProps {
  documentId: string;
}

export default function LabelingWorkspace(
  props: LabelingWorkspaceProps,
): JSX.Element {
  const { documentId } = props;
  const { document } = useLabelingContext();
  const { preferences, setPreferences } = usePreferences();
  const { views } = preferences;

  return (
    <div>
      <div style={{ flexGrow: 1 }}>
        <Typography variant="h5">{document.name}</Typography>
        <Typography variant="subtitle2">{document.filename}</Typography>
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
