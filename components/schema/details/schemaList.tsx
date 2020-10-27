import List from "@material-ui/core/List";
import firebase from "firebase/app";
import React, { useState } from "react";

import { AuthUser } from "../../../utils/auth/user";
import useRouterCreate from "../../../utils/common/useRouterCreate";
import useSnackbarRemove from "../../../utils/common/useRouterRemove";
import {
  FirestoreQuery,
  ResultSnackbarState,
  SchemaCollection,
} from "../../../utils/firestore/types";
import useFetchDocuments from "../../../utils/firestore/useFetchDocuments";
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
  const { remove } = useSnackbarRemove({
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
