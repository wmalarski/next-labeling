import React, { useEffect } from "react";
import "firebase/auth";
import { get } from "lodash";
import Link from "next/link";
import Router from "next/router";
import withAuthUser from "../utils/pageWrappers/withAuthUser";
import withAuthUserInfo from "../utils/pageWrappers/withAuthUserInfo";
import initFirebase from "../utils/auth/initFirebase";
import logout from "../utils/auth/logout";
import Header from "../components/header";
import Footer from "../components/footer";
import { AuthUserInfo } from "../utils/auth/user";

initFirebase();

export interface AccountProps {
  AuthUserInfo: AuthUserInfo;
}

function Account(props: any): JSX.Element {
  const { AuthUserInfo } = props;
  var authUser = AuthUserInfo.AuthUser;

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
