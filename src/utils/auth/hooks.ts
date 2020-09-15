import "firebase/auth";

import firebase from "firebase/app";
import React, { useEffect, useState } from "react";

import { setSession } from "./firebaseSessionHandler";
import initFirebase from "./initFirebase";
import { AuthUserInfo, createAuthUserInfo } from "./user";

initFirebase();

// https://benmcmahen.com/using-firebase-with-react-hooks/

// Defaults to empty AuthUserInfo object.
export const AuthUserInfoContext = React.createContext<AuthUserInfo>(
  createAuthUserInfo(),
);

export const useAuthUserInfo = (): AuthUserInfo => {
  return React.useContext(AuthUserInfoContext);
};

// Returns a Firebase JS SDK user object.
export const useFirebaseAuth = (): {
  initializing: boolean;
  user: firebase.User | null;
} => {
  const [state, setState] = useState(() => {
    const user = firebase.auth().currentUser;
    return {
      initializing: !user,
      user,
    };
  });

  function onChange(user: firebase.User | null) {
    setState({ initializing: false, user });

    // Call server to update session.
    setSession(user);
  }

  useEffect(() => {
    // Listen for auth state changes.
    const unsubscribe = firebase.auth().onAuthStateChanged(onChange);

    // Unsubscribe to the listener when unmounting.
    return () => unsubscribe();
  }, []);

  return state;
};
