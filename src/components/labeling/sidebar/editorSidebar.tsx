import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import FilterIcon from "@material-ui/icons/Filter";
import Filter1Icon from "@material-ui/icons/Filter1";
import Filter2Icon from "@material-ui/icons/Filter2";
import Filter3Icon from "@material-ui/icons/Filter3";
import Filter4Icon from "@material-ui/icons/Filter4";
import Filter5Icon from "@material-ui/icons/Filter5";
import Filter6Icon from "@material-ui/icons/Filter6";
import Filter7Icon from "@material-ui/icons/Filter7";
import Filter8Icon from "@material-ui/icons/Filter8";
import Filter9Icon from "@material-ui/icons/Filter9";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import LastPageIcon from "@material-ui/icons/LastPage";
import SaveIcon from "@material-ui/icons/Save";
import SettingsIcon from "@material-ui/icons/Settings";
import RedoIcon from "@material-ui/icons/Redo";
import UndoIcon from "@material-ui/icons/Undo";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import ViewListIcon from "@material-ui/icons/ViewList";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import clsx from "clsx";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";

import LabelingContext from "../../../contexts/labeling/labelingContext";
import { addObjectUpdate } from "../../../utils/labeling/updates";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap",
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: "hidden",
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: theme.mixins.toolbar,
    lists: {
      display: "flex",
      flexDirection: "column",
    },
    spacer: {
      flexGrow: 1,
    },
  }),
);

export default function EditorSidebar(): JSX.Element {
  const classes = useStyles();

  const router = useRouter();

  const { document, updateDoc, removeDoc, pushDoc } = useContext(
    LabelingContext,
  );
  const [open, setOpen] = useState(false);

  const filterIcons = [
    <FilterIcon key={0} />,
    <Filter1Icon key={1} />,
    <Filter2Icon key={2} />,
    <Filter3Icon key={3} />,
    <Filter4Icon key={4} />,
    <Filter5Icon key={5} />,
    <Filter6Icon key={6} />,
    <Filter7Icon key={7} />,
    <Filter8Icon key={8} />,
    <Filter9Icon key={9} />,
  ];

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
        <List>
          {document.schema.objects.map((object, index) => (
            <ListItem
              key={object.id}
              button
              onClick={() => pushDoc(doc => addObjectUpdate(doc, object))}
            >
              <ListItemIcon>
                {filterIcons[index % filterIcons.length]}
              </ListItemIcon>
              <ListItemText
                primary={object.name}
                secondary={`Add new ${object.name}`}
              />
            </ListItem>
          ))}
          <Divider />
          <ListItem button onClick={() => updateDoc(document)}>
            <ListItemIcon>
              <FileCopyIcon />
            </ListItemIcon>
            <ListItemText primary={"Copy"} />
          </ListItem>
          <ListItem button onClick={() => updateDoc(document)}>
            <ListItemIcon>
              <HighlightOffIcon />
            </ListItemIcon>
            <ListItemText primary={"Delete"} />
          </ListItem>
          <ListItem button onClick={() => updateDoc(document)}>
            <ListItemIcon>
              <ArrowBackIcon />
            </ListItemIcon>
            <ListItemText primary={"Delete Backward"} />
          </ListItem>
          <ListItem button onClick={() => updateDoc(document)}>
            <ListItemIcon>
              <ArrowForwardIcon />
            </ListItemIcon>
            <ListItemText primary={"Delete Forward"} />
          </ListItem>
          <Divider />
          <ListItem button onClick={() => updateDoc(document)}>
            <ListItemIcon>
              <FirstPageIcon />
            </ListItemIcon>
            <ListItemText primary={"First Frame"} />
          </ListItem>
          <ListItem button onClick={() => updateDoc(document)}>
            <ListItemIcon>
              <LastPageIcon />
            </ListItemIcon>
            <ListItemText primary={"Last Frame"} />
          </ListItem>
        </List>
        <div className={classes.spacer} />
        <List>
          <ListItem button onClick={() => updateDoc(document)}>
            <ListItemIcon>
              <UndoIcon />
            </ListItemIcon>
            <ListItemText primary={"Undo"} />
          </ListItem>
          <ListItem button onClick={() => removeDoc(document)}>
            <ListItemIcon>
              <RedoIcon />
            </ListItemIcon>
            <ListItemText primary={"Redo"} />
          </ListItem>
          <Divider />
          <ListItem button onClick={() => updateDoc(document)}>
            <ListItemIcon>
              <AccountTreeIcon />
            </ListItemIcon>
            <ListItemText primary={"Timeline"} />
          </ListItem>
          <ListItem button onClick={() => removeDoc(document)}>
            <ListItemIcon>
              <ViewListIcon />
            </ListItemIcon>
            <ListItemText primary={"Properties"} />
          </ListItem>
          <Divider />
          <ListItem button onClick={() => updateDoc(document)}>
            <ListItemIcon>
              <SaveIcon />
            </ListItemIcon>
            <ListItemText primary={"Save"} />
          </ListItem>
          <ListItem button onClick={() => removeDoc(document)}>
            <ListItemIcon>
              <DeleteOutlineIcon />
            </ListItemIcon>
            <ListItemText primary={"Remove"} />
          </ListItem>
          <ListItem button onClick={() => router.back()}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary={"Settings"} />
          </ListItem>
          <ListItem button onClick={() => router.back()}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary={"Exit"} />
          </ListItem>
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
