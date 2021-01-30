import { useContext } from "react";
import AuthContext, { AuthContextState } from "../authContext";

export default function useAuth(): AuthContextState {
  return useContext(AuthContext);
}
