import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { filterSelectedFields } from "../../workspace/functions";
import {
  currentFrameSelector,
  objectsSelector,
  selectedObjectSelector,
} from "../../workspace/redux/selectors";
import ObjectEditor from "./objectEditor";

function EditorTable(): JSX.Element {
  const selected = useSelector(selectedObjectSelector);
  const objects = useSelector(objectsSelector);
  const currentFrame = useSelector(currentFrameSelector);

  const filteredObjects = useMemo(
    () =>
      filterSelectedFields({
        currentFrame,
        objects,
        selected,
      }),
    [currentFrame, objects, selected],
  );

  return (
    <>
      {filteredObjects.map(pair => (
        <ObjectEditor pair={pair} />
      ))}
    </>
  );
}

export default React.memo(EditorTable);
