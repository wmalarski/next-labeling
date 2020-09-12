import React from "react";
import Link from "next/link";
import withAuthUser from "../src/utils/pageWrappers/withAuthUser";
import withAuthUserInfo from "../src/utils/pageWrappers/withAuthUserInfo";
import Header from "../src/components/common/header";
import Footer from "../src/components/common/footer";
import { AuthUserInfo } from "../src/utils/auth/user";

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
