import { AuthContextState } from "../authContext";
import useAuth from "./useAuth";

export default function useAuthWithRedirect(): AuthContextState {
  const context = useAuth();

  // useEffect(() => {
  //   if (!authUser && !isLoading) router.push("/login");
  // }, [authUser, isLoading, router]);

  return context;
}
