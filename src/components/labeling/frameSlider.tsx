import { IconButton } from "@material-ui/core";
import Grid from "@material-ui/core/Grid/Grid";
import Slider from "@material-ui/core/Slider/Slider";
import Typography from "@material-ui/core/Typography";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import Forward5Icon from "@material-ui/icons/Forward5";
import Replay5Icon from "@material-ui/icons/Replay5";
import React, { useContext } from "react";

import FramesContext from "../../contexts/frames/framesContext";

export default function FrameSlider(): JSX.Element {
  const { currentFrame, moveTo, moveBy } = useContext(FramesContext);

  return (
    <div>
      <Slider
        value={currentFrame}
        onChange={(_event, value) => moveTo(Number(value))}
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
  );
}
