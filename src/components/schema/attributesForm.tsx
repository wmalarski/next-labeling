import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  LabelingFieldSchema,
  LabelingObjectSchema,
} from "../../utils/schema/types";
import Divider from "@material-ui/core/Divider";
import AccordionActions from "@material-ui/core/AccordionActions";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import ReplayIcon from "@material-ui/icons/Replay";
import SaveIcon from "@material-ui/icons/Save";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import RemoveIcon from "@material-ui/icons/Remove";
import { FieldType, LabelingFieldAttributes } from "../../utils/schema/fields";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { CompactPicker } from "react-color";
import ComboBoxForm from "./comboBoxForm";
import SelectForm from "./selectForm";
import MulSelectForm from "./mulSelectForm";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      justifyContent: "space-between",
    },
    column: {
      flexBasis: "33.33%",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
  })
);

export interface AttributesFormProps {
  type: FieldType;
  attributes: LabelingFieldAttributes[FieldType];
  onChange: (attributes: LabelingFieldAttributes[FieldType]) => void;
}

export default function AttributesForm(
  props: AttributesFormProps
): JSX.Element {
  const { type, attributes, onChange } = props;
  const classes = useStyles();

  switch (type) {
    case FieldType.LINE:
    case FieldType.POINT:
    case FieldType.POLYGON:
    case FieldType.RECTANGLE:
      const colorAttributes = attributes as LabelingFieldAttributes[typeof type];
      return (
        <CompactPicker
          color={colorAttributes.color}
          onChangeComplete={(color) => onChange({ color: color.hex })}
        />
      );
    case FieldType.CHECKBOX:
      const checkBoxAttributes = attributes as LabelingFieldAttributes[typeof type];
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={checkBoxAttributes.default}
              onChange={(event) => onChange({ default: event.target.checked })}
            />
          }
          label="Default value"
        />
      );
    case FieldType.TEXT:
      const textAttributes = attributes as LabelingFieldAttributes[typeof type];
      return (
        <TextField
          label="Default"
          variant="outlined"
          margin="dense"
          fullWidth
          value={textAttributes.default}
          onChange={(event) => onChange({ default: event.target.value })}
        />
      );
    case FieldType.NUMBER:
      const numberAttributes = attributes as LabelingFieldAttributes[typeof type];
      return (
        <>
          <TextField
            label="Default"
            type="number"
            margin="dense"
            fullWidth
            value={numberAttributes.default}
            onChange={(event) =>
              onChange({
                ...numberAttributes,
                default: Number(event.target.value),
              })
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Min"
            type="number"
            margin="dense"
            fullWidth
            value={numberAttributes.min}
            onChange={(event) =>
              onChange({ ...numberAttributes, min: Number(event.target.value) })
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Max"
            type="number"
            margin="dense"
            fullWidth
            value={numberAttributes.max}
            onChange={(event) =>
              onChange({ ...numberAttributes, max: Number(event.target.value) })
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Step"
            type="number"
            margin="dense"
            fullWidth
            value={numberAttributes.step}
            onChange={(event) =>
              onChange({
                ...numberAttributes,
                step: Number(event.target.value),
              })
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
        </>
      );
    case FieldType.COMBOBOX:
      const comboBoxAttributes = attributes as LabelingFieldAttributes[typeof type];
      return (
        <ComboBoxForm attributes={comboBoxAttributes} onChange={onChange} />
      );
    case FieldType.SELECT:
      const selectAttributes = attributes as LabelingFieldAttributes[typeof type];
      return <SelectForm attributes={selectAttributes} onChange={onChange} />;
    case FieldType.MULSELECT:
      const multiselectAttributes = attributes as LabelingFieldAttributes[typeof type];
      return (
        <MulSelectForm attributes={multiselectAttributes} onChange={onChange} />
      );
    default:
      return <></>;
  }
}
