import React, { useEffect } from "react";
import "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import withAuthUser from "../src/utils/pageWrappers/withAuthUser";
import withAuthUserInfo from "../src/utils/pageWrappers/withAuthUserInfo";
import initFirebase from "../src/utils/auth/initFirebase";
import Header from "../src/components/common/header";
import Footer from "../src/components/common/footer";
import { AuthUserInfo } from "../src/utils/auth/user";

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
