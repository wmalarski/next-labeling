import firebase from "firebase/app";
import { createContext } from "react";
import { AuthUser } from "./types";

export interface AuthContextState {
  userDetails: firebase.User | null;
  authUser: AuthUser | null;
  isLoading: boolean;
  error: firebase.auth.Error | null;
}

const AuthContext = createContext<AuthContextState>({
  authUser: null,
  userDetails: null,
  isLoading: false,
  error: null,
});

export default AuthContext;
