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
      const typeAttributes = attributes as LabelingFieldAttributes[typeof type];
      return (
        <div>
          <CompactPicker
            color={typeAttributes.color}
            onChangeComplete={(color) => onChange({ color: color.hex })}
          />
        </div>
      );
    case FieldType.CHECKBOX:
      return <></>;
    case FieldType.COMBOBOX:
      return <></>;
    case FieldType.TEXT:
      return <></>;
    case FieldType.NUMBER:
      return <></>;
    case FieldType.SELECT:
      return <></>;
    case FieldType.MULSELECT:
      return <></>;
    default:
      return <></>;
  }
}
