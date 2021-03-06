import Button, { ButtonProps } from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import React from "react";

export interface ButtonTooltipProps {
  title: string;
}

function ButtonTooltip(props: ButtonProps & ButtonTooltipProps): JSX.Element {
  const { title, disabled, ...other } = props;

  return !disabled ? (
    <Tooltip title={title}>
      <Button {...other} />
    </Tooltip>
  ) : (
    <Button {...other} disabled />
  );
}

export default React.memo(ButtonTooltip);
