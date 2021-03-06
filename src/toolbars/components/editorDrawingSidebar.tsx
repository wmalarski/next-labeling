import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import { useSelector } from "react-redux";
import { useRootDispatch } from "../../common/redux/store";
import getCoordsBuilders from "../../editors/builders/getCoordsBuilder";
import { schemaSelector } from "../../workspace/redux/selectors";
import { setDrawingTool } from "../../workspace/redux/slice";
import { filterIcons } from "../../workspace/views";

function EditorDrawingSidebar(): JSX.Element {
  const dispatch = useRootDispatch();
  const schema = useSelector(schemaSelector);

  return (
    <List>
      {schema.objects
        .filter(objectSchema => !objectSchema.singleton)
        .map((objectSchema, index) => {
          const ToolIcon = filterIcons[index % filterIcons.length];
          const fieldSchema = objectSchema.fields.find(
            field =>
              !!getCoordsBuilders({
                fieldSchema: field,
                objectSchema,
              }),
          );
          return (
            fieldSchema && (
              <ListItem
                key={objectSchema.id}
                button
                onClick={() =>
                  dispatch(setDrawingTool({ fieldSchema, objectSchema }))
                }
              >
                <ListItemIcon>
                  <ToolIcon />
                </ListItemIcon>
                <ListItemText
                  primary={objectSchema.name}
                  secondary={`Add new ${objectSchema.name}`}
                />
              </ListItem>
            )
          );
        })}
    </List>
  );
}

export default React.memo(EditorDrawingSidebar);
