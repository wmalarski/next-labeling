import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { get } from "lodash";
import Link from "next/link";
import Router from "next/router";
import withAuthUser from "../../utils/pageWrappers/withAuthUser";
import withAuthUserInfo from "../../utils/pageWrappers/withAuthUserInfo";
import initFirebase from "../../utils/auth/initFirebase";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { AuthUserInfo, AuthUser } from "../../utils/auth/user";
import { auth } from "firebase-admin";

initFirebase();

export interface AccountUpdateNameProps {
  authUserInfo: AuthUserInfo;
}

const AccountUpdateName = (props: AccountUpdateNameProps) => {
  const { authUserInfo } = props;
  var authUser = authUserInfo.authUser;
  var input: HTMLInputElement | null = null;

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(authUser);

  const handleDisplayNameSubmit = async () => {
    if (!authUser) return;
    try {
      var user = firebase.auth().currentUser;
      if (user) {
        await user.updateProfile({
          displayName: input?.value || "",
        });
        setCurrentUser({
          displayName: user.displayName ?? "",
          email: user.email,
          emailVerified: user.emailVerified,
          id: authUser.id,
        });
      }
      Router.push("/account");
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    if (!authUser) {
      Router.push("/");
    }
    if (input) {
      input.value = authUser?.displayName || "";
      input.focus();
    }
  });

  return (
    <>
      {!currentUser ? (
        <></>
      ) : (
        <>
          <Header />
          <p>
            <label htmlFor="displayName">display name: </label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              ref={(r) => (input = r)}
              defaultValue=""
            />
          </p>
          <p>
            <button onClick={handleDisplayNameSubmit}>[ update ]</button>
          </p>
          <p>
            <Link href="/account">
              <a>[ back to account ]</a>
            </Link>
          </p>
          <Footer />
        </>
      )}
    </>
  );
};

export default withAuthUser(withAuthUserInfo(AccountUpdateName));
