import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AspectRatioIcon from "@material-ui/icons/AspectRatio";
import PanToolIcon from "@material-ui/icons/PanTool";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import ToggleButton from "@material-ui/lab/ToggleButton";
import React, { useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import usePreferences from "../../utils/labeling/hooks/usePreferencesContext";
import useToolContext from "../../utils/labeling/hooks/useToolContext";
import { ToolType } from "../../utils/labeling/types/client";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1),
    },
  }),
);

export interface VideoHeaderProps {
  onResetClicked: () => void;
  onZoomInClicked: () => void;
  onZoomOutlicked: () => void;
}

export default function VideoHeader(props: VideoHeaderProps): JSX.Element {
  const { onResetClicked, onZoomInClicked, onZoomOutlicked } = props;
  const classes = useStyles();

  const { toolType, setTool } = useToolContext();
  const { preferences } = usePreferences();
  const { shortcuts } = preferences;

  const setPan = useCallback(
    () => setTool({ toolType: ToolType.ZOOM_AND_PANE }),
    [setTool],
  );

  useHotkeys(shortcuts.SetPanTool, setPan, [setPan]);

  return (
    <div className={classes.root}>
      <ToggleButton
        selected={toolType === ToolType.ZOOM_AND_PANE}
        onClick={setPan}
        value="pan"
      >
        <PanToolIcon />
        {" Pan"}
      </ToggleButton>
      <Button startIcon={<AspectRatioIcon />} onClick={onResetClicked}>
        Reset View
      </Button>
      <Button startIcon={<ZoomInIcon />} onClick={onZoomInClicked}>
        Zoom In
      </Button>
      <Button startIcon={<ZoomOutIcon />} onClick={onZoomOutlicked}>
        Zoom Out
      </Button>
    </div>
  );
}
