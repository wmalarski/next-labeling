import React, { useEffect } from "react";
import "firebase/auth";
import Link from "next/link";
import Router from "next/router";
import withAuthUser from "../src/utils/pageWrappers/withAuthUser";
import withAuthUserInfo from "../src/utils/pageWrappers/withAuthUserInfo";
import initFirebase from "../src/utils/auth/initFirebase";
import logout from "../src/utils/auth/logout";
import Header from "../src/components/common/header";
import Footer from "../src/components/common/footer";
import { AuthUserInfo } from "../src/utils/auth/user";

initFirebase();

export interface AccountProps {
  authUserInfo: AuthUserInfo;
}

function Account(props: AccountProps): JSX.Element {
  const { authUserInfo } = props;
  var authUser = authUserInfo.authUser;

  useEffect(() => {
    if (!authUser) {
      Router.push("/");
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
            <button
              onClick={async () => {
                try {
                  await logout();
                  Router.push("/login");
                } catch (e) {
                  console.error(e);
                }
              }}
            >
              [ log out ]
            </button>
          </p>
          <Footer />
        </>
      )}
    </>
  );
}

export default withAuthUser(withAuthUserInfo(Account));
