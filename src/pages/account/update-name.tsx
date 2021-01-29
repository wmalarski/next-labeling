import "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthUserInfo } from "../../auth/hooks";
import initFirebase from "../../auth/initFirebase";
import Footer from "../../common/components/footer";
import Header from "../../common/components/header";
import withAuthUser from "../../common/wrappers/withAuthUser";
import withAuthUserInfo from "../../common/wrappers/withAuthUserInfo";

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
