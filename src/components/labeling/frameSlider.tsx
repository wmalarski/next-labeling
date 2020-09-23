import Grid from "@material-ui/core/Grid/Grid";
import Slider from "@material-ui/core/Slider/Slider";
import Typography from "@material-ui/core/Typography";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import Forward5Icon from "@material-ui/icons/Forward5";
import Replay5Icon from "@material-ui/icons/Replay5";
import React, { useContext } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import FramesContext from "../../contexts/frames/framesContext";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    frameSlider: {
      // position: "fixed",
      // bottom: 0,
      // right: 0,
      // left: 0,
      zIndex: theme.zIndex.drawer + 1,
      backgroundColor: theme.palette.background.default,
    },
    padding: {
      padding: theme.spacing(3),
    },
  }),
);

export default function FrameSlider(): JSX.Element {
  const classes = useStyles();
  const { currentFrame, duration, moveTo, moveBy } = useContext(FramesContext);

  return (
    <div className={classes.frameSlider}>
      <Divider />
      <div className={classes.padding}>
        <Slider
          value={currentFrame}
          min={0}
          max={duration}
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
            <Typography variant="subtitle2">{`Frame: ${
              currentFrame + 1
            }`}</Typography>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
