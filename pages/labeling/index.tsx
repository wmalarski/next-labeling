import "firebase/firestore";

import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import firebase from "firebase/app";
import usePagination from "firestore-pagination-hook";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

import Footer from "../../components/common/footer";
import Header from "../../components/common/header";
import LoadingBackdrop from "../../components/common/loadingBackdrop";
import ResultSnackbar from "../../components/common/resultSnackbar";
import { AuthUserInfoContext } from "../../utils/auth/hooks";
import initFirebase from "../../utils/auth/initFirebase";
import {
  LabelingCollection,
  ResultSnackbarState,
} from "../../utils/firestore/types";
import withAuthUser from "../../components/pageWrappers/withAuthUser";
import withAuthUserInfo from "../../components/pageWrappers/withAuthUserInfo";

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
