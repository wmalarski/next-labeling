import Typography from "@material-ui/core/Typography";
import dynamic from "next/dynamic";
import React, { useContext } from "react";

import LabelingContext from "../../contexts/labeling/labelingContext";

const MainStageNoSSR = dynamic(() => import("../visualization/mainStage"), {
  ssr: false,
});

export default function LabelingWorkspace(): JSX.Element {
  const { document } = useContext(LabelingContext);

  return (
    <div>
      <MainStageNoSSR />
      <Typography variant="h5">{document.name}</Typography>
      <Typography variant="subtitle2">{document.filename}</Typography>
    </div>
  );
}
