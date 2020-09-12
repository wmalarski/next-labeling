import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import Link from "next/link";
import Router from "next/router";
import initFirebase from "../src/utils/auth/initFirebase";
import Footer from "../src/components/common/footer";
import { useUserFormStyles } from "../src/themes/styles";
import Container from "@material-ui/core/Container";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

initFirebase();

export default function Signup(): JSX.Element {
  const classes = useUserFormStyles();

  const handleSubmit = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    e.persist();
    try {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(
          e.target.email.value,
          e.target.password1.value
        );
      const user = firebase.auth().currentUser;
      if (user) {
        await user.updateProfile({
          displayName: e.target.displayName.value,
        });
      }
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
            <LockOpenIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>

          <form onSubmit={handleSubmit}>
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
              name="password1"
              label="Password"
              type="password"
              id="password1"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="displayName"
              label="Display Name"
              name="displayName"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Create Account
            </Button>
          </form>
          <p>
            {"or "}
            <Link href="/login">
              <a>log in</a>
            </Link>
          </p>
        </div>
      </Container>
      <Footer />
    </>
  );
}
