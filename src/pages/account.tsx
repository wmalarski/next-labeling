import "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import initFirebase from "../auth/initFirebase";
import { AuthUserInfo } from "../auth/user";
import Footer from "../common/components/footer";
import Header from "../common/components/header";
import withAuthUser from "../common/wrappers/withAuthUser";
import withAuthUserInfo from "../common/wrappers/withAuthUserInfo";

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
