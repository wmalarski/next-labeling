import React, { useState, useEffect, ChangeEvent } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import Link from "next/link";
import Router from "next/router";
import initFirebase from "../src/utils/auth/initFirebase";
import Footer from "../src/components/common/footer";
import { googleAuthProvider } from "../src/utils/auth/authProviders";

initFirebase();

type Inputs = {
  email: string;
  password: string;
};

const initial: Inputs = {
  email: "",
  password: "",
};

export default function Login(): JSX.Element {
  var firstInput: HTMLInputElement | null = null;

  const [inputs, setInputs] = useState(initial);

  const handleSubmit = async (e: ChangeEvent<any>) => {
    e.preventDefault();
    try {
      await firebase
        .auth()
        .signInWithEmailAndPassword(inputs.email, inputs.password);
      Router.push("/");
    } catch (error) {
      alert(error);
    }
  };

  const handleGoogleLogin = async () => {
    console.log("handleGoogleLogin");
    try {
      await firebase.auth().signInWithPopup(googleAuthProvider);
      Router.push("/");
    } catch (error) {
      alert(error);
    }
  };

  const handleInputChange = (e: ChangeEvent<any>) => {
    e.persist();
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    firstInput?.focus();
  }, []); // [] = run once

  return (
    <>
      <form onSubmit={handleSubmit}>
        <p>
          <label htmlFor="email">email: </label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={handleInputChange}
            value={inputs.email}
            ref={(r) => (firstInput = r)}
          />
        </p>
        <p>
          <label htmlFor="password">password: </label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={handleInputChange}
            value={inputs.password}
          />
        </p>
        <p>
          <button type="submit">[ log in ]</button>
        </p>
      </form>
      <p>
        <button onClick={handleGoogleLogin}>[ Sing in with Google]</button>
      </p>
      <p>
        {"or "}
        <Link href="/signup">
          <a>[ create account ]</a>
        </Link>
      </p>
      <Footer />
    </>
  );
}
