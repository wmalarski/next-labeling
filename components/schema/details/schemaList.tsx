import List from "@material-ui/core/List";
import firebase from "firebase/app";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { AuthUser } from "../../../utils/auth/user";
import {
  FirestoreQuery,
  ResultSnackbarState,
  SchemaCollection,
} from "../../../utils/firestore/types";
import useFetchDocuments from "../../../utils/firestore/useFetchDocuments";
import useRemoveDocument from "../../../utils/firestore/useRemoveDocument";
import useRouterCreate from "../../../utils/firestore/useRouterCreate";
import { SchemaDocument } from "../../../utils/schema/types";
import LoadingBackdrop from "../../common/loadingBackdrop";
import ResultSnackbar from "../../common/resultSnackbar";
import SchemaListItem from "./schemaListItem";

export interface SchemaListProps {
  authUser: AuthUser;
  query: FirestoreQuery;
}

export function SchemaList(props: SchemaListProps): JSX.Element {
  const { query, authUser } = props;

  const router = useRouter();

  const { loading, loadingMore, hasMore, items, loadMore } = useFetchDocuments({
    query,
    type: SchemaDocument,
    options: { limit: 10 },
  });

  const [snackbarState, setSnackbarState] = useState<ResultSnackbarState>({
    isOpen: false,
  });

  const collection = firebase.firestore().collection(SchemaCollection);
  const createSchema = useRouterCreate<SchemaDocument>({
    collection,
    setSnackbarState,
    routerOptions: (_document, id) => ({
      url: "/schema/[schemaId]",
      as: `/schema/${id}`,
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

  return (
    <>
      <List>
        {items.map(pair => {
          return (
            <SchemaListItem
              key={pair.id}
              schemaId={pair.id}
              document={pair.document}
              onCopyClicked={() =>
                createSchema.create({
                  ...document,
                  user: authUser,
                  stars: 0,
                  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                })
              }
              onRemoveClicked={() => removeSchema(pair.id)}
            />
          );
        })}
        {hasMore && !loadingMore && (
          <button onClick={loadMore}>[ more ]</button>
        )}
      </List>
      <ResultSnackbar state={snackbarState} setState={setSnackbarState} />
      <LoadingBackdrop isLoading={loading || createSchema.isLoading} />
    </>
  );
}
