import "firebase/firestore";

import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import AddIcon from "@material-ui/icons/Add";
import firebase from "firebase/app";
import usePagination from "firestore-pagination-hook";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

import Footer from "../../src/components/common/footer";
import Header from "../../src/components/common/header";
import LoadingBackdrop from "../../src/components/common/loadingBackdrop";
import ResultSnackbar from "../../src/components/common/resultSnackbar";
import SearchInput from "../../src/components/common/searchInput";
import SchemaListItem from "../../src/components/schema/details/schemaListItem";
import { AuthUserInfoContext } from "../../src/utils/auth/hooks";
import initFirebase from "../../src/utils/auth/initFirebase";
import {
  ResultSnackbarState,
  SchemaCollection,
} from "../../src/utils/firestore/types";
import useCreate from "../../src/utils/firestore/useCreate";
import useRemoveDocument from "../../src/utils/firestore/useRemoveDocument";
import withAuthUser from "../../src/utils/pageWrappers/withAuthUser";
import withAuthUserInfo from "../../src/utils/pageWrappers/withAuthUserInfo";
import { SchemaDocument } from "../../src/utils/schema/types";

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

  const { loading, loadingMore, hasMore, items, loadMore } = usePagination(
    db.collection(SchemaCollection).orderBy("created", "asc"),
    {
      limit: 10,
    },
  );

  const [snackbarState, setSnackbarState] = useState<ResultSnackbarState>({
    isOpen: false,
  });

  const createSchema = useCreate<SchemaDocument>({
    collection: SchemaCollection,
    setSnackbarState,
    routerOptions: document => ({
      url: "/schema/schemaId",
      as: `/schema/${document.id}`,
    }),
  });

  const { remove: removeSchema, state: removeSchemaState } = useRemoveDocument(
    SchemaCollection,
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
