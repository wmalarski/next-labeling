import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CodeIcon from "@material-ui/icons/Code";
import Link from "next/link";
import React, { PropsWithChildren } from "react";
import { useAuthUserInfo } from "../../auth/hooks";
import { useHeaderStyles } from "../styles";
import SignUpHeader from "./signUpHeader";
import UserHeader from "./userHeader";

export interface HeaderProps {
  siteTitle?: string;
}

export default function Header(
  props: PropsWithChildren<HeaderProps>,
): JSX.Element {
  const { siteTitle = "Next Labeling", children } = props;
  const classes = useHeaderStyles();
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
