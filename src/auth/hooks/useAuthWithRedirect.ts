import { useRouter } from "next/router";
import { AuthContextState } from "../authContext";
import useAuth from "./useAuth";

export default function useAuthWithRedirect(): AuthContextState {
  const context = useAuth();
  const router = useRouter();

  const { authUser, isLoading } = context;

  // useEffect(() => {
  //   if (!authUser && !isLoading) router.push("/login");
  // }, [authUser, isLoading, router]);

  return context;
}
