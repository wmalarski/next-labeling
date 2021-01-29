import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import React from "react";

export interface NumberInputProps {
  min: number;
  max: number;
  value: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}

export default function NumberInput(props: NumberInputProps): JSX.Element {
  const { min, max, value, disabled = false, onChange } = props;
  return (
    <>
      <IconButton
        disabled={disabled}
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="left"
      >
        <KeyboardArrowLeftIcon />
      </IconButton>
      {!disabled ? value : ""}
      <IconButton
        disabled={disabled}
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label="right"
      >
        <KeyboardArrowRightIcon />
      </IconButton>
    </>
  );
}
