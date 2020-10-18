import Typography from "@material-ui/core/Typography";
import dynamic from "next/dynamic";
import React from "react";

import useLabelingContext from "../../utils/labeling/hooks/useLabelingContext";

// const MainStageNoSSR = dynamic(() => import("../visualization/mainStage"), {
//   ssr: false,
// });
const KonvaStageNoSSR = dynamic(() => import("../visualization/konvaStage"), {
  ssr: false,
});

export default function LabelingWorkspace(): JSX.Element {
  const { document } = useLabelingContext();

  return (
    <div>
      <KonvaStageNoSSR />
      <Typography variant="h5">{document.name}</Typography>
      <Typography variant="subtitle2">{document.filename}</Typography>
    </div>
  );
}
