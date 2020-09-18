import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MailIcon from "@material-ui/icons/Mail";
import MenuIcon from "@material-ui/icons/Menu";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import clsx from "clsx";
import React, { useContext } from "react";

import LabelingContext from "../../../contexts/labeling/labelingContext";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: "none",
    },
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
  }),
);

export default function EditorSidebar(): JSX.Element {
  const classes = useStyles();

  const { document } = useContext(LabelingContext);
  const [open, setOpen] = React.useState(false);

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
      <List>
        <div className={classes.toolbar} />
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <List>
        <ListItem button onClick={() => setOpen(!open)}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <ListItemText primary={"Show"} />
        </ListItem>
      </List>
    </Drawer>
  );
  // return (
  //   <>
  //     <Typography variant="h5">{document.name}</Typography>
  //     <Typography variant="subtitle2">{document.filename}</Typography>
  //     <pre>{JSON.stringify(document, null, 2)}</pre>
  //     <ButtonGroup size="small" color="inherit" variant="text">
  //       <Button
  //         disabled={!isSameUser}
  //         startIcon={<SaveIcon />}
  //         onClick={() => {
  //           if (document) {
  //             // updateLabeling(documentId, { ...document, schema });
  //           }
  //         }}
  //       >
  //         Save
  //       </Button>
  //       <Button
  //         startIcon={<DeleteOutlineIcon />}
  //         onClick={() => {
  //           removeSchema(documentId);
  //           router.back();
  //         }}
  //       >
  //         Remove
  //       </Button>
  //       <Button startIcon={<ExitToAppIcon />} onClick={() => router.back()}>
  //         Return
  //       </Button>
  //     </ButtonGroup>
  //   </>
  // );
}
