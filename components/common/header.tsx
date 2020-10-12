import { Theme } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CodeIcon from "@material-ui/icons/Code";
import { makeStyles } from "@material-ui/styles";
import Link from "next/link";
import React, { PropsWithChildren } from "react";

import { useAuthUserInfo } from "../../utils/auth/hooks";
import SignUpHeader from "./signUpHeader";
import UserHeader from "./userHeader";

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  grow: {
    flexGrow: 1,
  },
  offset: theme.mixins.toolbar,
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
}));

export interface HeaderProps {
  siteTitle?: string;
}

export default function Header(
  props: PropsWithChildren<HeaderProps>,
): JSX.Element {
  const { siteTitle = "Next Labeling", children } = props;
  const classes = useStyles();
  const { authUser } = useAuthUserInfo();

  return (
    <>
      <AppBar className={classes.appBar} component="header" position="fixed">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Link href="/" passHref>
              <Button color="inherit" startIcon={<CodeIcon />} component="a">
                {siteTitle}
              </Button>
            </Link>
          </Typography>
          {children}
          <div className={classes.grow} />
          {authUser ? <UserHeader /> : <SignUpHeader />}
        </Toolbar>
      </AppBar>
      <div className={classes.offset} />
    </>
  );
}
