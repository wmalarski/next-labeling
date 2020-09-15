import React from "react";

import Footer from "../src/components/common/footer";
import Header from "../src/components/common/header";
import withAuthUser from "../src/utils/pageWrappers/withAuthUser";
import withAuthUserInfo from "../src/utils/pageWrappers/withAuthUserInfo";

function Index(): JSX.Element {
  return (
    <>
      <Header />
      <Footer />
    </>
  );
}

export default withAuthUser(withAuthUserInfo(Index));
