import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup/ToggleButtonGroup";
import React from "react";
import { useSelector } from "react-redux";
import NumberInput from "../../common/components/numberInput";
import { useRootDispatch } from "../../common/redux/store";
import { setPreferences } from "../../workspace/redux/slice";
import { LabelingDirection } from "../../workspace/redux/state";
import {
  autoSaveDelayMinutesSelector,
  frameStepSelector,
  labelingDirectionSelector,
} from "../redux/selectors";

function LabelingSettings(): JSX.Element {
  const dispatch = useRootDispatch();
  const labelingDirection = useSelector(labelingDirectionSelector);
  const frameStep = useSelector(frameStepSelector);
  const delayMinutes = useSelector(autoSaveDelayMinutesSelector);

  return (
    <Grid container>
      <Grid item xs={4}>
        Labeling Direction
      </Grid>
      <Grid item xs={6}>
        <ToggleButtonGroup
          value={labelingDirection}
          exclusive
          onChange={(_event, value) =>
            dispatch(setPreferences({ labelingDirection: value }))
          }
          aria-label="text alignment"
        >
          <ToggleButton
            value={LabelingDirection.BACKWARD}
            aria-label="backward"
          >
            Backward
          </ToggleButton>
          <ToggleButton value={LabelingDirection.FORWARD} aria-label="forward">
            Forward
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
      <Grid item xs={4}>
        Frame step
      </Grid>
      <Grid item xs={6}>
        <NumberInput
          max={16}
          min={1}
          value={frameStep}
          onChange={value => setPreferences({ frameChangeStep: value })}
        />
      </Grid>
      <Grid item xs={4}>
        Autosave interval(minutes)
      </Grid>
      <Grid item xs={6}>
        <FormControlLabel
          control={
            <Checkbox
              checked={!!delayMinutes}
              onChange={() =>
                setPreferences({
                  autoSaveDelayMinutes: delayMinutes ? null : 5,
                })
              }
              name="checkedA"
            />
          }
          label="Enable"
        />
        <NumberInput
          max={16}
          min={1}
          disabled={!delayMinutes}
          value={delayMinutes ?? 5}
          onChange={value => setPreferences({ autoSaveDelayMinutes: value })}
        />
      </Grid>
    </Grid>
  );
}

export default React.memo(LabelingSettings);
