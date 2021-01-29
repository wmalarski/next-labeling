// From:
// https://github.com/zeit/next.js/blob/canary/examples/with-firebase-authentication/pages/index.js
import firebase from "firebase/app";
import fetch from "isomorphic-unfetch";

export const setSession = (user: firebase.User | null): Promise<Response> => {
  // Log in.
  if (user) {
    return user.getIdToken().then((token: string) => {
      return fetch("/api/login", {
        method: "POST",
        // eslint-disable-next-line no-undef
        headers: new Headers({ "Content-Type": "application/json" }),
        credentials: "same-origin",
        body: JSON.stringify({ token }),
      });
    });
  }

  // Log out.
  return fetch("/api/logout", {
    method: "POST",
    credentials: "same-origin",
  });
};
