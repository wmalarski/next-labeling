import "firebase/auth";

import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import Footer from "../../components/common/footer";
import Header from "../../components/common/header";
import withAuthUser from "../../components/pageWrappers/withAuthUser";
import withAuthUserInfo from "../../components/pageWrappers/withAuthUserInfo";
import { useAuthUserInfo } from "../../utils/auth/hooks";
import initFirebase from "../../utils/auth/initFirebase";

initFirebase();

function AccountUpdateName(): JSX.Element {
  const { authUser } = useAuthUserInfo();
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
