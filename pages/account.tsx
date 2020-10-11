import "firebase/auth";

import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import Footer from "../components/common/footer";
import Header from "../components/common/header";
import initFirebase from "../utils/auth/initFirebase";
import { AuthUserInfo } from "../utils/auth/user";
import withAuthUser from "../utils/pageWrappers/withAuthUser";
import withAuthUserInfo from "../utils/pageWrappers/withAuthUserInfo";

initFirebase();

export interface AccountProps {
  authUserInfo: AuthUserInfo;
}

function Account(props: AccountProps): JSX.Element {
  const { authUserInfo } = props;
  const router = useRouter();
  const authUser = authUserInfo.authUser;

  useEffect(() => {
    if (!authUser) {
      router.push("/");
    }
  });

  return (
    <>
      {!authUser ? (
        <></>
      ) : (
        <>
          <Header />
          <div>
            <label htmlFor="displayName">display name</label>{" "}
            <Link href="/account/update-name">
              <a>[ update ]</a>
            </Link>
            <p>{authUser.displayName}</p>
          </div>
          <p>
            <button>[ log out ]</button>
          </p>
          <Footer />
        </>
      )}
    </>
  );
}

export default withAuthUser(withAuthUserInfo(Account));
