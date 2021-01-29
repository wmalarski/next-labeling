import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import FieldEditor from "../../../editors/components/fieldEditor";
import { FieldType, LabelingFieldValues } from "../../../editors/types";
import { FieldSchema } from "../../types";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      margin: theme.spacing(1),
      padding: theme.spacing(1),
    },
  }),
);

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

export default function FieldDetails(props: FieldDetailsProps): JSX.Element {
  const { field } = props;
  const [type, fieldAttributes] = Object.entries(field.attributes)[0];
  const fieldType = type as FieldType;

  const classes = useStyles();

  const [values, setValues] = useState<LabelingFieldValues>(
    getDefaultValues(fieldType, fieldAttributes),
  );
  const isCorrectType = type === Object.keys(values)[0];

  useEffect(() => {
    setValues(getDefaultValues(fieldType, fieldAttributes));
  }, [fieldType, fieldAttributes, setValues]);

  if (!isCorrectType) return <></>;

  return (
    <>
      <Typography variant="h5">{field.name}</Typography>
      <Typography variant="subtitle2">{`Per frame: ${field.perFrame}`}</Typography>
      <Paper className={classes.paper}>
        <FieldEditor
          frame={0}
          attributes={field.attributes}
          disabled={false}
          name={field.name}
          perFrame={false}
          values={values}
          onChange={provider =>
            setValues(oldValues => {
              const result = provider(oldValues);
              if (!result) return oldValues;
              return result;
            })
          }
        />
      </Paper>
    </>
  );
}
