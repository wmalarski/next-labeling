import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ReplayIcon from "@material-ui/icons/Replay";
import TreeItem from "@material-ui/lab/TreeItem";
import TreeView from "@material-ui/lab/TreeView";
import React from "react";
import usePreferences from "../../../utils/labeling/hooks/usePreferencesContext";
import { shortcutCategories } from "../../../utils/labeling/shortcuts";

export default function ShortcutsSettingsTreeView(): JSX.Element {
  const { preferences, setPreferences } = usePreferences();

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      disableSelection
    >
      {shortcutCategories.map(category => (
        <TreeItem
          key={category.name}
          nodeId={category.name}
          label={category.name}
        >
          {category.actions.map(action => (
            <TreeItem
              key={action.name}
              nodeId={action.name}
              onKeyDown={event => event.stopPropagation()}
              onFocusCapture={event => event.preventDefault()}
              label={
                <Grid container>
                  <Grid item xs={6}>
                    {action.name}
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      margin="dense"
                      onChange={event => {
                        event.stopPropagation();
                        const value = event.target.value;
                        setPreferences({
                          ...preferences,
                          shortcuts: {
                            ...preferences.shortcuts,
                            [action.action]: value,
                          },
                        });
                      }}
                      value={
                        preferences.shortcuts[action.action] ?? action.default
                      }
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      onClick={() =>
                        setPreferences({
                          ...preferences,
                          shortcuts: {
                            ...preferences.shortcuts,
                            [action.action]: action.default,
                          },
                        })
                      }
                      aria-label="reset-shortcut"
                    >
                      <ReplayIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              }
            />
          ))}
        </TreeItem>
      ))}
    </TreeView>
  );
}