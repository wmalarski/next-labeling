import React, { useEffect, useState } from "react";
import { LabelingFieldSchema } from "../../../utils/schema/types";
import Typography from "@material-ui/core/Typography";
import FieldEditor from "../../editors/fieldEditor";
import { FieldType, LabelingFieldValues } from "../../../utils/editors/types";
import ToggleButton from "@material-ui/lab/ToggleButton";
import CodeIcon from "@material-ui/icons/Code";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

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
  field: LabelingFieldSchema;
}

export default function FieldDetails(props: FieldDetailsProps): JSX.Element {
  const { field } = props;
  const [type, fieldAttributes] = Object.entries(field.attributes)[0];
  const fieldType = type as FieldType;

  const classes = useStyles();

  const [isRawVisible, setIsRawVisible] = useState(false);
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
      <ToggleButton
        value="raw"
        aria-label="raw"
        size="small"
        color="inherit"
        onChange={() => setIsRawVisible(!isRawVisible)}
      >
        <CodeIcon />
        Show Raw
      </ToggleButton>
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

      {isRawVisible ? (
        <Paper className={classes.paper}>
          <pre className="text-xs">
            {JSON.stringify(field.attributes || {}, null, 2)}
          </pre>
        </Paper>
      ) : (
        <></>
      )}
    </>
  );
}
