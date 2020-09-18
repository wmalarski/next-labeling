import Typography from "@material-ui/core/Typography";
import React, { useContext } from "react";
import LabelingContext from "../../contexts/labeling/labelingContext";

export default function LabelingWorkspace(): JSX.Element {
  const { document } = useContext(LabelingContext);
  return (
    <>
      <div>
        <Typography variant="h5">{document.name}</Typography>
        <Typography variant="subtitle2">{document.filename}</Typography>
        <pre>{JSON.stringify(document, null, 2)}</pre>
      </div>
    </>
  );
}
