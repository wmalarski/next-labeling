import React from "react";
import Footer from "../common/components/footer";
import Header from "../common/components/header";
import withAuthUser from "../common/wrappers/withAuthUser";
import withAuthUserInfo from "../common/wrappers/withAuthUserInfo";

function Index(): JSX.Element {
  return (
    <>
      <Header />
      <Footer />
    </>
  );
}

export default withAuthUser(withAuthUserInfo(Index));
