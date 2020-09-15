import React from "react";
import withAuthUser from "../src/utils/pageWrappers/withAuthUser";
import withAuthUserInfo from "../src/utils/pageWrappers/withAuthUserInfo";
import Header from "../src/components/common/header";
import Footer from "../src/components/common/footer";

function Index(): JSX.Element {
  return (
    <>
      <Header />
      <Footer />
    </>
  );
}

export default withAuthUser(withAuthUserInfo(Index));
