import React from "react";
import Link from "next/link";
import withAuthUser from "../utils/pageWrappers/withAuthUser";
import withAuthUserInfo from "../utils/pageWrappers/withAuthUserInfo";
import Header from "../components/header";
import Footer from "../components/footer";
import { AuthUserInfo } from "../utils/auth/user";

export interface IndexProps {
  authUserInfo?: AuthUserInfo;
}

function Index(props: IndexProps): JSX.Element {
  const { authUserInfo } = props;
  const authUser = authUserInfo?.authUser;

  return (
    <>
      <Header />
      {!authUser ? (
        <>
          <div>not signed in.</div>
          <div>
            <Link href={"/login"}>
              <a>[ log in ]</a>
            </Link>
          </div>
          <p>
            <Link href={"/signup"}>
              <a>[ create account ]</a>
            </Link>
          </p>
        </>
      ) : (
        <>
          <pre className="text-xs">{JSON.stringify(authUser, null, 2)}</pre>
          <p>
            <Link href={"/account"}>
              <a>[ account ]</a>
            </Link>
          </p>
          <p>
            <Link href={"/spaces"}>
              <a>[ spaces ]</a>
            </Link>
          </p>
        </>
      )}
      <>
        <Footer />
      </>
    </>
  );
}

export default withAuthUser(withAuthUserInfo(Index));
