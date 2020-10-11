import React from "react";

import Footer from "../components/common/footer";
import Header from "../components/common/header";
import withAuthUser from "../utils/pageWrappers/withAuthUser";
import withAuthUserInfo from "../utils/pageWrappers/withAuthUserInfo";

function Index(): JSX.Element {
  return (
    <>
      <Header />
      <Footer />
    </>
  );
}

export default withAuthUser(withAuthUserInfo(Index));
