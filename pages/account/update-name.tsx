import "firebase/auth";

import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";

import Footer from "../../src/components/common/footer";
import Header from "../../src/components/common/header";
import { AuthUserInfoContext } from "../../src/utils/auth/hooks";
import initFirebase from "../../src/utils/auth/initFirebase";
import withAuthUser from "../../src/utils/pageWrappers/withAuthUser";
import withAuthUserInfo from "../../src/utils/pageWrappers/withAuthUserInfo";

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
