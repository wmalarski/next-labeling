import React from "react";
import Link from "next/link";
import { makeStyles } from "@material-ui/styles";
import { Container, Typography, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: "auto",
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function Footer(): JSX.Element {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <Container maxWidth="md">
        <Typography variant="body1" color="textSecondary">
          <Link href={"/about"}>
            <a className="text-xs">[ about ]</a>
          </Link>
          <Link href={"/terms"}>
            <a className="text-xs">[ terms ]</a>
          </Link>{" "}
          © {new Date().getFullYear()}, Built with{" "}
          <Link href="https://firebase.google.com/">Firebase</Link>,{" "}
          <Link href="https://nextjs.org/">NextJS</Link>,{" "}
          <Link href="https://www.typescriptlang.org">Typescript</Link> and{" "}
          <Link href="https://material-ui.com/">@Material-ui</Link>
        </Typography>
      </Container>
    </footer>
  );
}
