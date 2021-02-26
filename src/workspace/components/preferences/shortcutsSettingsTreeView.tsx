import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ReplayIcon from "@material-ui/icons/Replay";
import TreeItem from "@material-ui/lab/TreeItem";
import TreeView from "@material-ui/lab/TreeView";
import React from "react";
import { useSelector } from "react-redux";
import { useRootDispatch } from "../../../common/redux/store";
import { shortcutsSelector } from "../../redux/selectors";
import { setShortcut } from "../../redux/slice";
import { shortcutCategories } from "../../shortcuts";

export default function ShortcutsSettingsTreeView(): JSX.Element {
  const dispatch = useRootDispatch();
  const shortcuts = useSelector(shortcutsSelector);

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
                        dispatch(
                          setShortcut({ action: action.action, key: value }),
                        );
                      }}
                      value={shortcuts[action.action] ?? action.default}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      onClick={() =>
                        dispatch(
                          setShortcut({
                            action: action.action,
                            key: action.default,
                          }),
                        )
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
