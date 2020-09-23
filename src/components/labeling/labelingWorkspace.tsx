import Typography from "@material-ui/core/Typography";
import dynamic from "next/dynamic";
import React, { useContext } from "react";

import LabelingContext from "../../contexts/labeling/labelingContext";

const MainStageNoSSR = dynamic(() => import("../visualization/mainStage"), {
  ssr: false,
});

export default function LabelingWorkspace(): JSX.Element {
  const { document } = useContext(LabelingContext);
  // if (typeof window !== "undefined") return <></>;

  return (
    <div>
      <Typography variant="h5">{document.name}</Typography>
      <Typography variant="subtitle2">{document.filename}</Typography>
      <MainStageNoSSR />
    </div>
  );
}
