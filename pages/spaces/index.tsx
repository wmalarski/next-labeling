import React, { useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import Link from "next/link";
import Router from "next/router";
import withAuthUser from "../../src/utils/pageWrappers/withAuthUser";
import withAuthUserInfo from "../../src/utils/pageWrappers/withAuthUserInfo";
import initFirebase from "../../src/utils/auth/initFirebase";
import usePagination from "firestore-pagination-hook";
import Header from "../../src/components/common/header";
import Footer from "../../src/components/common/footer";
import { AuthUserInfo } from "../../src/utils/auth/user";

initFirebase();

export interface SpacesProps {
  authUserInfo?: AuthUserInfo;
}

function Spaces(props: SpacesProps): JSX.Element {
  const { authUserInfo } = props;
  const authUser = authUserInfo?.authUser;

  useEffect(() => {
    if (!authUser) {
      Router.push("/");
    }
  });

  const db = firebase.firestore();
  const { loading, loadingMore, hasMore, items, loadMore } = usePagination(
    db
      .collection("spaces")
      .where("uid", "==", authUser?.id || "")
      .orderBy("spaceId", "asc"),
    {
      limit: 10,
    }
  );

  return (
    <>
      {!authUser ? (
        <></>
      ) : (
        <>
          <Header />
          <label>spaces</label>{" "}
          <Link href={"/spaces/create"}>
            <a>[ create ]</a>
          </Link>
          <div>
            {loading && <div>...</div>}
            {items.map((item) => (
              <pre className="text-xs">
                {JSON.stringify(item.data() || {}, null, 2)}
              </pre>
            ))}
            {hasMore && !loadingMore && (
              <button onClick={loadMore}>[ more ]</button>
            )}
          </div>
          <Footer />
        </>
      )}
    </>
  );
}

export default withAuthUser(withAuthUserInfo(Spaces));
