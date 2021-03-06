import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import clsx from "clsx";
import React, { useState } from "react";
import EditorSettingsDialog from "../../preferences/components/editorSettingsDialog";
import { useEditorSidebarStyles } from "../../workspace/styles";
import EditorDrawingSidebar from "./editorDrawingSidebar";
import EditorItemsSidebar from "./editorItemsSidebar";
import EditorViewsSidebar from "./editorViewsSidebar";

function EditorSidebar(): JSX.Element {
  const classes = useEditorSidebarStyles();

  const [open, setOpen] = useState(true);

  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
    >
      <div className={classes.toolbar} />
      <div className={classes.lists}>
        <EditorDrawingSidebar />
        <Divider />
        <EditorItemsSidebar />
        <div className={classes.spacer} />
        <EditorViewsSidebar />
        <Divider />
        <List>
          <EditorSettingsDialog />
          <Divider />
          <ListItem button onClick={() => setOpen(!open)}>
            <ListItemIcon>
              {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </ListItemIcon>
            <ListItemText primary={"Hide"} />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
}

export default React.memo(EditorSidebar);
