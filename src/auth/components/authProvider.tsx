import firebase from "firebase/app";
import nookies from "nookies";
import React, { useEffect, useMemo, useState } from "react";
import { firebaseClient } from "../../firebase/firebaseClient";
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
  const [loading, setLoading] = useState<boolean>(false);

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
      setLoading(true);
      const token = await user.getIdToken();
      setUser(user);
      setLoading(false);
      nookies.destroy(null, "token");
      nookies.set(null, "token", token, {});
    });
  }, []);

  // force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      const user = firebaseClient.auth().currentUser;
      if (user) {
        setLoading(true);
        await user.getIdToken(true);
        setLoading(false);
      }
    }, 10 * 60 * 1000);
    return () => clearInterval(handle);
  }, []);

  const authUser = useMemo(() => createAuthUser(user), [user]);

  return (
    <AuthContext.Provider
      value={{ userDetails: user, authUser, isLoading: loading, error: null }}
    >
      {children}
    </AuthContext.Provider>
  );
}
