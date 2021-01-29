import "firebase/auth";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import firebase from "firebase/app";
import Link from "next/link";
import Router from "next/router";
import React, { ChangeEvent } from "react";

import Footer from "../common/components/footer";
import { useUserFormStyles } from "../themes/styles";
import { googleAuthProvider } from "../auth/authProviders";
import initFirebase from "../auth/initFirebase";

initFirebase();

export default function Login(): JSX.Element {
  const classes = useUserFormStyles();

  const handleSubmit = async (e: ChangeEvent<any>) => {
    e.preventDefault();
    try {
      await firebase
        .auth()
        .signInWithEmailAndPassword(
          e.target.email.value,
          e.target.password.value,
        );
      Router.push("/");
    } catch (error) {
      alert(error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await firebase.auth().signInWithPopup(googleAuthProvider);
      Router.push("/");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
          </form>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            className={classes.submit}
            onClick={handleGoogleLogin}
          >
            Sing in with Google
          </Button>
          <p>
            {"or "}
            <Link href="/signup">
              <a>create account</a>
            </Link>
          </p>
        </div>
      </Container>
      <Footer />
    </>
  );
}
