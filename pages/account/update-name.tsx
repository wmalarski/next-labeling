import "firebase/auth";

import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";

import Footer from "../../components/common/footer";
import Header from "../../components/common/header";
import { AuthUserInfoContext } from "../../utils/auth/hooks";
import initFirebase from "../../utils/auth/initFirebase";
import withAuthUser from "../../utils/pageWrappers/withAuthUser";
import withAuthUserInfo from "../../utils/pageWrappers/withAuthUserInfo";

initFirebase();

function AccountUpdateName(): JSX.Element {
  const { authUser } = useContext(AuthUserInfoContext);
  const router = useRouter();

  useEffect(() => {
    if (!authUser) {
      router.push("/");
    }
  });

  return (
    <>
      <Header />
      <Link href="/account">
        <a>[ back to account ]</a>
      </Link>
      <Footer />
    </>
  );
}

export default withAuthUser(withAuthUserInfo(AccountUpdateName));
