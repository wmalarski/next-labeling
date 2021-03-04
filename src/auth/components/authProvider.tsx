import firebase from "firebase/app";
import nookies from "nookies";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { firebaseClient } from "../../firebase/firebaseClient";
import { UsersCollection } from "../../firebase/types";
import AuthContext from "../authContext";
import { AuthUser } from "../types";

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const createAuthUser = (
  firebaseUser: firebase.User | null,
): AuthUser | null => {
  if (!firebaseUser || !firebaseUser.uid) {
    return null;
  }
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    emailVerified: firebaseUser.emailVerified,
    displayName: firebaseUser.displayName ?? "",
  };
};

// https://colinhacks.com/essays/nextjs-firebase-authentication
export default function AuthProvider(props: AuthProviderProps): JSX.Element {
  const { children } = props;

  const [user, setUser] = useState<firebase.User | null>(null);

  const setCollectionUser = useCallback((user: firebase.User): void => {
    firebase
      .firestore()
      .collection(UsersCollection)
      .doc(user.uid)
      .set(
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          projects: [],
        },
        {
          mergeFields: [],
        },
      )
      .then(() => console.log("success"))
      .catch(err => console.log("Failure", err));
  }, []);

  // listen for token changes
  // call setUser and write new token as a cookie
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).nookies = nookies;
    }
    return firebaseClient.auth().onIdTokenChanged(async user => {
      if (!user) {
        setUser(null);
        nookies.destroy(null, "token");
        nookies.set(null, "token", "", {});
        return;
      }
      const token = await user.getIdToken();
      setUser(user);
      nookies.destroy(null, "token");
      nookies.set(null, "token", token, {});
      setCollectionUser(user);
    });
  }, [setCollectionUser]);

  // force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      const user = firebaseClient.auth().currentUser;
      if (user) {
        await user.getIdToken(true);
      }
    }, 10 * 60 * 1000);
    return () => clearInterval(handle);
  }, []);

  const authUser = useMemo(() => createAuthUser(user), [user]);

  return (
    <AuthContext.Provider
      value={{ userDetails: user, authUser, isLoading: false, error: null }}
    >
      {children}
    </AuthContext.Provider>
  );
}
