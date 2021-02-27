import Button from "@material-ui/core/Button";
import AspectRatioIcon from "@material-ui/icons/AspectRatio";
import PanToolIcon from "@material-ui/icons/PanTool";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import ToggleButton from "@material-ui/lab/ToggleButton";
import React, { useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useSelector } from "react-redux";
import { useRootDispatch } from "../../common/redux/store";
import { toolTypeSelector } from "../../editors/redux/selectors";
import { shortcutsSelector } from "../../preferences/redux/selectors";
import { setToolType } from "../../workspace/redux/slice";
import { ToolType } from "../../workspace/types/client";
import { useVideoHeaderStyles } from "../styles";

export interface VideoHeaderProps {
  onResetClicked: () => void;
  onZoomInClicked: () => void;
  onZoomOutClicked: () => void;
}

export default function VideoHeader(props: VideoHeaderProps): JSX.Element {
  const { onResetClicked, onZoomInClicked, onZoomOutClicked } = props;
  const classes = useVideoHeaderStyles();

  const dispatch = useRootDispatch();
  const toolType = useSelector(toolTypeSelector);
  const shortcuts = useSelector(shortcutsSelector);

  const setPan = useCallback(
    () => void dispatch(setToolType(ToolType.ZOOM_AND_PANE)),
    [dispatch],
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
      <Button startIcon={<ZoomOutIcon />} onClick={onZoomOutClicked}>
        Zoom Out
      </Button>
    </div>
  );
}
