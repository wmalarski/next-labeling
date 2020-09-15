import Button from "@material-ui/core/Button";
import { useRouter } from "next/router";
import React from "react";

export default function SignUpHeader(): JSX.Element {
  const router = useRouter();

  return (
    <>
      <Button onClick={() => router.push("/login")}>Log in</Button>
      <Button onClick={() => router.push("/signup")} variant="outlined">
        Sign up
      </Button>
    </>
  );
}
