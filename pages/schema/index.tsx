import "firebase/firestore";

import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import AddIcon from "@material-ui/icons/Add";
import firebase from "firebase/app";
import usePagination from "firestore-pagination-hook";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

import Footer from "../../components/common/footer";
import Header from "../../components/common/header";
import LoadingBackdrop from "../../components/common/loadingBackdrop";
import ResultSnackbar from "../../components/common/resultSnackbar";
import SearchInput from "../../components/common/searchInput";
import withAuthUser from "../../components/pageWrappers/withAuthUser";
import withAuthUserInfo from "../../components/pageWrappers/withAuthUserInfo";
import SchemaListItem from "../../components/schema/details/schemaListItem";
import { AuthUserInfoContext } from "../../utils/auth/hooks";
import initFirebase from "../../utils/auth/initFirebase";
import {
  ResultSnackbarState,
  SchemaCollection,
} from "../../utils/firestore/types";
import useCreate from "../../utils/firestore/useCreate";
import useRemoveDocument from "../../utils/firestore/useRemoveDocument";
import { SchemaDocument } from "../../utils/schema/types";

initFirebase();

function SchemaList(): JSX.Element {
  const { authUser } = useContext(AuthUserInfoContext);
  const router = useRouter();

  useEffect(() => {
    if (!authUser) {
      router.push("/");
    }
  });

  const db = firebase.firestore();
  const collection = db.collection(SchemaCollection);

  const { loading, loadingMore, hasMore, items, loadMore } = usePagination(
    collection.orderBy("created", "asc"),
    {
      limit: 10,
    },
  );

  const [snackbarState, setSnackbarState] = useState<ResultSnackbarState>({
    isOpen: false,
  });

  const createSchema = useCreate<SchemaDocument>({
    collection,
    setSnackbarState,
    routerOptions: document => ({
      url: "/schema/schemaId",
      as: `/schema/${document.id}`,
    }),
  });

  const { remove: removeSchema, state: removeSchemaState } = useRemoveDocument(
    collection,
  );
  useEffect(() => {
    if (removeSchemaState.success) {
      setSnackbarState({ isOpen: true, message: "Schema removed" });
    } else if (removeSchemaState.errors) {
      setSnackbarState({
        isOpen: true,
        message: `${removeSchemaState.errors}`,
      });
    }
  }, [removeSchemaState.errors, removeSchemaState.success, router]);

  if (!authUser) return <></>;

  return (
    <>
      <Header>
        <>
          <SearchInput onSubmit={() => void 0} />
          <Button
            size="small"
            color="inherit"
            startIcon={<AddIcon />}
            onClick={() => router.push("/schema/create")}
          >
            New Schema
          </Button>
        </>
      </Header>
      <Container>
        {items.map(doc => {
          const document = doc.data();
          return (
            <SchemaListItem
              key={doc.id}
              document={{ ...document, id: doc.id }}
              onCopyClicked={() =>
                createSchema.create({
                  ...document,
                  user: authUser,
                  stars: 0,
                  created: new Date().toJSON(),
                })
              }
              onRemoveClicked={() => removeSchema(doc.id)}
            />
          );
        })}
        {hasMore && !loadingMore && (
          <button onClick={loadMore}>[ more ]</button>
        )}
      </Container>
      <ResultSnackbar state={snackbarState} setState={setSnackbarState} />
      <LoadingBackdrop isLoading={loading || createSchema.isLoading} />
      <Footer />
    </>
  );
}

export default withAuthUser(withAuthUserInfo(SchemaList));
