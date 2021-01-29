import List from "@material-ui/core/List";
import firebase from "firebase/app";
import React, { useState } from "react";
import { AuthUser } from "../../../auth/user";
import LoadingBackdrop from "../../../common/components/loadingBackdrop";
import ResultSnackbar from "../../../common/components/resultSnackbar";
import useRouterCreate from "../../../common/hooks/useRouterCreate";
import useRouterRemove from "../../../common/hooks/useRouterRemove";
import useFetchDocuments from "../../../firestore/hooks/useFetchDocuments";
import {
  FirestoreQuery,
  ResultSnackbarState,
  SchemaCollection,
} from "../../../firestore/types";
import { SchemaDocument } from "../../types";
import SchemaListItem from "./schemaListItem";

export interface SchemaListProps {
  authUser: AuthUser;
  query: FirestoreQuery;
}

export function SchemaList(props: SchemaListProps): JSX.Element {
  const { query, authUser } = props;

  const { loading, hasMore, items, loadMore } = useFetchDocuments({
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
  const { remove } = useRouterRemove({
    backOnSuccess: false,
    successMessage: "Schema removed",
    setSnackbarState,
    collection,
  });

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
              onRemoveClicked={() => remove(pair.id)}
            />
          );
        })}
        {hasMore && <button onClick={loadMore}>[ more ]</button>}
      </List>
      <ResultSnackbar state={snackbarState} setState={setSnackbarState} />
      <LoadingBackdrop isLoading={loading || createSchema.isLoading} />
    </>
  );
}
