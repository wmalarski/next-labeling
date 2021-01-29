import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import React from "react";
import SearchInput from "../../common/components/searchInput";
import useLabelingContext from "../../workspace/hooks/useLabelingContext";
import { IsDoneFilterValue } from "../../workspace/types/client";
import { UseXZoomResult } from "../hooks/useXZoom";
import { TimelineZoomControls } from "./timelineZoomControls";

export interface TimelineFilterControlsProps {
  zoom: UseXZoomResult;
}

export function TimelineFilterControls(
  props: TimelineFilterControlsProps,
): JSX.Element {
  const { zoom } = props;

  const { document, filters, setFilters, history } = useLabelingContext();
  const index = history.data.currentFrame;
  const isDoneValue =
    filters.isDone === IsDoneFilterValue.ALL ? null : filters.isDone;

  return (
    <Grid container>
      <Grid item xs={4}>
        <SearchInput
          onSubmit={value =>
            setFilters({ ...filters, name: value === "" ? null : value })
          }
        />
      </Grid>
      <Grid item xs={2}>
        <ToggleButtonGroup
          value={isDoneValue}
          exclusive
          onChange={(_event, value) =>
            setFilters({
              ...filters,
              isDone: !value ? IsDoneFilterValue.ALL : value,
            })
          }
          aria-label="is done buttons"
        >
          <ToggleButton value={IsDoneFilterValue.IS_DONE} aria-label="done">
            DONE
          </ToggleButton>
          <ToggleButton value={IsDoneFilterValue.WIP} aria-label="wip">
            WIP
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
      <Grid item xs={2}>
        {document.schema.objects.map(objectSchema => {
          const isSelected = filters.objectSchemaIds.includes(objectSchema.id);
          return (
            <Chip
              key={objectSchema.id}
              label={objectSchema.name}
              color={isSelected ? "primary" : "default"}
              onClick={() => {
                const newIds = [...filters.objectSchemaIds];
                setFilters({
                  ...filters,
                  objectSchemaIds: isSelected
                    ? newIds.filter(id => id !== objectSchema.id)
                    : [...newIds, objectSchema.id],
                });
              }}
            />
          );
        })}
      </Grid>
      <Grid item xs={2}>
        <TimelineZoomControls zoom={zoom} index={index} />
      </Grid>
    </Grid>
  );
}
