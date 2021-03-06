import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import React from "react";
import { useSelector } from "react-redux";
import SearchInput from "../../common/components/searchInput";
import { useRootDispatch } from "../../common/redux/store";
import {
  filtersSelector,
  schemaSelector,
} from "../../workspace/redux/selectors";
import { setFilters } from "../../workspace/redux/slice";
import { IsDoneFilterValue } from "../../workspace/types/client";

function TimelineFilterControls(): JSX.Element {
  const dispatch = useRootDispatch();
  const filters = useSelector(filtersSelector);
  const schema = useSelector(schemaSelector);

  const isDoneValue =
    filters.isDone === IsDoneFilterValue.ALL ? null : filters.isDone;

  return (
    <Grid container>
      <Grid item xs={4}>
        <SearchInput
          onSubmit={value =>
            dispatch(setFilters({ name: value === "" ? null : value }))
          }
        />
      </Grid>
      <Grid item xs={2}>
        <ToggleButtonGroup
          value={isDoneValue}
          exclusive
          onChange={(_event, value) =>
            dispatch(
              setFilters({
                isDone: !value ? IsDoneFilterValue.ALL : value,
              }),
            )
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
        {schema.objects.map(objectSchema => {
          const isSelected = filters.objectSchemaIds.includes(objectSchema.id);
          return (
            <Chip
              key={objectSchema.id}
              label={objectSchema.name}
              color={isSelected ? "primary" : "default"}
              onClick={() => {
                const newIds = [...filters.objectSchemaIds];
                dispatch(
                  setFilters({
                    objectSchemaIds: isSelected
                      ? newIds.filter(id => id !== objectSchema.id)
                      : [...newIds, objectSchema.id],
                  }),
                );
              }}
            />
          );
        })}
      </Grid>
    </Grid>
  );
}

export default React.memo(TimelineFilterControls);
