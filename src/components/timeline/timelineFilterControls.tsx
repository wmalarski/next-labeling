import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import React from "react";

import useLabelingContext from "../../utils/labeling/hooks/useLabelingContext";
import { IsDoneFilterValue } from "../../utils/labeling/types/client";
import SearchInput from "../common/searchInput";

export function TimelineFilterControls(): JSX.Element {
  const { document, filters, setFilters } = useLabelingContext();
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
      <Grid item xs={6}>
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
    </Grid>
  );
}
