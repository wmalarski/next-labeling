import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { useSchemaDetailsStyles } from "../../styles";
import { SchemaDocument } from "../../types";
import FieldDetails from "./fieldDetails";

interface SchemaDetailsProps {
  schemaDocument: SchemaDocument;
}

export default function SchemaDetails(props: SchemaDetailsProps): JSX.Element {
  const { schema, user } = props.schemaDocument;
  const classes = useSchemaDetailsStyles();

  return (
    <Container>
      <Paper className={classes.paper} elevation={3}>
        <Typography variant="h5">{schema.name}</Typography>
        <Typography variant="subtitle2">{`Version: ${schema.version}`}</Typography>
        <Typography variant="subtitle1">{schema.description}</Typography>
        <Typography variant="subtitle2">{`Author: ${user?.displayName}`}</Typography>
        <Divider />
        <List>
          {schema.objects.map(object => (
            <div key={object.id}>
              <ListItem>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <div>
                      <Typography variant="h6">{object.name}</Typography>
                      <Typography variant="body2">
                        {object.description}
                      </Typography>
                      <Typography variant="subtitle2">{`Singleton: ${object.singleton}`}</Typography>
                    </div>
                  </Grid>
                  <Grid item xs={8}>
                    <List>
                      {object.fields.map(field => (
                        <div key={field.id}>
                          <ListItem>
                            <Grid container>
                              <Grid item xs={6}>
                                <FieldDetails field={field} />
                              </Grid>
                              <Grid item xs={6}>
                                <pre>
                                  {JSON.stringify(
                                    field.attributes || {},
                                    null,
                                    2,
                                  )}
                                </pre>
                              </Grid>
                            </Grid>
                          </ListItem>
                          <Divider />
                        </div>
                      ))}
                    </List>
                  </Grid>
                </Grid>{" "}
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      </Paper>
    </Container>
  );
}
