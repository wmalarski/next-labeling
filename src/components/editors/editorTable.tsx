import React, { useContext } from "react";

import LabelingContext from "../../contexts/labeling/labelingContext";

export default function EditorTable(): JSX.Element {
  const { document } = useContext(LabelingContext);

  return (
    <div>
      <pre>{JSON.stringify(document.data, null, 2)}</pre>
    </div>
  );
}
