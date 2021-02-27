import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import FieldEditor from "../../../editors/components/fieldEditor";
import { FieldType, LabelingFieldValues } from "../../../editors/types";
import { useFieldDetailsStyles } from "../../styles";
import { FieldSchema } from "../../types";

function getDefaultValues(type: FieldType, attributes: any) {
  return {
    [type]: [
      {
        frame: -1,
        value: attributes?.default,
      },
    ],
  };
}

export interface FieldDetailsProps {
  field: FieldSchema;
}

export default function FieldDetails(
  props: FieldDetailsProps,
): JSX.Element | null {
  const { field: fieldSchema } = props;
  const [type, fieldAttributes] = Object.entries(fieldSchema.attributes)[0];
  const fieldType = type as FieldType;

  const classes = useFieldDetailsStyles();

  const [values, setValues] = useState<LabelingFieldValues>(
    getDefaultValues(fieldType, fieldAttributes),
  );
  const isCorrectType = type === Object.keys(values)[0];

  useEffect(() => {
    setValues(getDefaultValues(fieldType, fieldAttributes));
  }, [fieldType, fieldAttributes, setValues]);

  if (!isCorrectType) return null;

  return (
    <>
      <Typography variant="h5">{fieldSchema.name}</Typography>
      <Typography variant="subtitle2">{`Per frame: ${fieldSchema.perFrame}`}</Typography>
      <Paper className={classes.paper}>
        <FieldEditor
          frame={0}
          field={{
            fieldSchema,
            fieldSchemaId: fieldSchema.id,
            id: "",
            values,
          }}
          disabled={false}
          onChange={setValues}
        />
      </Paper>
    </>
  );
}
