import React from "react";

import Footer from "../components/common/footer";
import Header from "../components/common/header";
import withAuthUser from "../components/pageWrappers/withAuthUser";
import withAuthUserInfo from "../components/pageWrappers/withAuthUserInfo";

function Index(): JSX.Element {
  return (
    <>
      <Header />
      <Footer />
    </>
  );
}

export default withAuthUser(withAuthUserInfo(Index));
