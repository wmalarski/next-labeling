import "firebase/auth";

import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import Footer from "../src/components/common/footer";
import Header from "../src/components/common/header";
import initFirebase from "../src/utils/auth/initFirebase";
import { AuthUserInfo } from "../src/utils/auth/user";
import withAuthUser from "../src/utils/pageWrappers/withAuthUser";
import withAuthUserInfo from "../src/utils/pageWrappers/withAuthUserInfo";

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
