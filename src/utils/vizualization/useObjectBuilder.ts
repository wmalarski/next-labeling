import { useMemo } from "react";

import { ExtendedObject } from "../labeling/types";
import getCoordsBuilders from "./coordsBuilders";
import useCoordsBuilder, { UseCoordsBuilderResult } from "./useCoordsBuilder";

export default function useObjectBuilder(
  object?: ExtendedObject,
): UseCoordsBuilderResult {
  const builders = useMemo(() => getCoordsBuilders(object), [object]);
  return useCoordsBuilder(builders[0]);
}
