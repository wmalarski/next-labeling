import "firebase/firestore";

import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import firebase from "firebase/app";
import usePagination from "firestore-pagination-hook";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

import Footer from "../../src/components/common/footer";
import Header from "../../src/components/common/header";
import LoadingBackdrop from "../../src/components/common/loadingBackdrop";
import ResultSnackbar from "../../src/components/common/resultSnackbar";
import { AuthUserInfoContext } from "../../src/utils/auth/hooks";
import initFirebase from "../../src/utils/auth/initFirebase";
import {
  LabelingCollection,
  ResultSnackbarState,
} from "../../src/utils/firestore/types";
import withAuthUser from "../../src/utils/pageWrappers/withAuthUser";
import withAuthUserInfo from "../../src/utils/pageWrappers/withAuthUserInfo";

initFirebase();

function LabelingList(): JSX.Element {
  const { authUser } = useContext(AuthUserInfoContext);
  const router = useRouter();

  useEffect(() => {
    if (!authUser) {
      router.push("/");
    }
  });

  const db = firebase.firestore();

  const {
    loading,
    loadingMore,
    hasMore,
    items,
    loadMore,
  } = usePagination(db.collection(LabelingCollection), { limit: 10 });

  const [snackbarState, setSnackbarState] = useState<ResultSnackbarState>({
    isOpen: false,
  });

  if (!authUser) return <></>;

  return (
    <>
      <Header />
      <Container>
        {items.map(doc => {
          const document = doc.data();
          return (
            <div key={doc.id}>
              {document.name}
              <Button
                onClick={() =>
                  router.push("/labeling/[labelingId]", `/labeling/${doc.id}`)
                }
              >
                Edit
              </Button>
            </div>
          );
        })}

        {hasMore && !loadingMore && (
          <button onClick={loadMore}>[ more ]</button>
        )}
      </Container>
      <ResultSnackbar state={snackbarState} setState={setSnackbarState} />
      <LoadingBackdrop isLoading={loading} />
      <Footer />
    </>
  );
}

export default withAuthUser(withAuthUserInfo(LabelingList));
