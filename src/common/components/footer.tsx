import { Container, Typography } from "@material-ui/core";
import Link from "next/link";
import React from "react";
import { useFooterStyles } from "../styles";

export default function Footer(): JSX.Element {
  const classes = useFooterStyles();
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
