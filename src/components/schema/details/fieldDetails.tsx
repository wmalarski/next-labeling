import React, { useEffect, useState } from "react";
import { LabelingFieldSchema } from "../../../utils/schema/types";
import Typography from "@material-ui/core/Typography";
import FieldEditor from "../../editors/fieldEditor";
import { FieldType, LabelingFieldValues } from "../../../utils/editors/types";

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
      <Typography variant="subtitle1">{`Per frame: ${field.perFrame}`}</Typography>
      <Typography variant="subtitle2">
        {`${Object.keys(field.attributes)[0]}`}
      </Typography>
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
      <pre className="text-xs">
        {JSON.stringify(field.attributes || {}, null, 2)}
      </pre>
    </>
  );
}
