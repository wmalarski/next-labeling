import React from "react";
import Link from "next/link";
import withAuthUser from "../src/utils/pageWrappers/withAuthUser";
import withAuthUserInfo from "../src/utils/pageWrappers/withAuthUserInfo";
import Header from "../src/components/common/header";
import Footer from "../src/components/common/footer";
import { AuthUserInfo } from "../src/utils/auth/user";

export interface IndexProps {
  authUserInfo?: AuthUserInfo;
}

function Index(props: IndexProps): JSX.Element {
  const { authUserInfo } = props;
  const authUser = authUserInfo?.authUser;

  return (
    <>
      <Header />
      <Footer />
    </>
  );
}

export default withAuthUser(withAuthUserInfo(Index));
