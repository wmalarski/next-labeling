import firebase from "firebase/app";
import { createContext } from "react";
import { AuthUser } from "./types";

export interface AuthContextState {
  userDetails: firebase.User | null;
  authUser: AuthUser | null;
}

const AuthContext = createContext<AuthContextState>({
  authUser: null,
  userDetails: null,
});

export default AuthContext;
