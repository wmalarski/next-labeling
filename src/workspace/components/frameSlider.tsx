import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid/Grid";
import IconButton from "@material-ui/core/IconButton";
import Slider from "@material-ui/core/Slider/Slider";
import Typography from "@material-ui/core/Typography";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import Forward5Icon from "@material-ui/icons/Forward5";
import Replay5Icon from "@material-ui/icons/Replay5";
import React, { useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { frameToRange } from "../functions";
import useLabelingContext from "../hooks/useLabelingContext";
import usePreferences from "../hooks/usePreferencesContext";
import { useFrameSliderStyles } from "../styles";
import setCurrentFrameUpdate from "../updates/setCurrentFrameUpdate";

export default function FrameSlider(): JSX.Element {
  const classes = useFrameSliderStyles();
  const { history, duration } = useLabelingContext();
  const { pushLabeling } = history;
  const { currentFrame } = history.data;
  const { preferences } = usePreferences();
  const { frameChangeStep: frameStep, shortcuts } = preferences;

  const moveBy = useCallback(
    (value: number): void =>
      pushLabeling(data =>
        setCurrentFrameUpdate(
          data,
          frameToRange(currentFrame + Number(value) * frameStep, duration),
          frameStep,
        ),
      ),
    [currentFrame, duration, frameStep, pushLabeling],
  );

  useHotkeys(shortcuts.DoubleFrameBackward, () => moveBy(-5), [moveBy]);
  useHotkeys(shortcuts.FrameBackward, () => moveBy(-1), [moveBy]);
  useHotkeys(shortcuts.FrameForward, () => moveBy(1), [moveBy]);
  useHotkeys(shortcuts.DoubleFrameForward, () => moveBy(-5), [moveBy]);

  return (
    <div className={classes.frameSlider}>
      <Divider />
      <div className={classes.padding}>
        <Slider
          value={currentFrame}
          min={0}
          max={duration}
          step={frameStep}
          onChange={(_event, value) =>
            pushLabeling(data =>
              setCurrentFrameUpdate(
                data,
                frameToRange(Number(value), duration),
                frameStep,
              ),
            )
          }
          aria-labelledby="continuous-slider"
        />

        <Grid container spacing={2}>
          <Grid item xs />
          <Grid item>
            <IconButton size="small" onClick={() => moveBy(-5)}>
              <Replay5Icon />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton size="small" onClick={() => moveBy(-1)}>
              <ArrowLeftIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton size="small" onClick={() => moveBy(1)}>
              <ArrowRightIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton size="small" onClick={() => moveBy(5)}>
              <Forward5Icon />
            </IconButton>
          </Grid>

          <Grid item xs />
          <Grid item>
            <Typography variant="subtitle2">{`Frame: ${currentFrame}`}</Typography>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
