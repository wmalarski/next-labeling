import List from "@material-ui/core/List";
import firebase from "firebase/app";
import React from "react";
import { AuthUser } from "../../../auth/types";
import LoadingBackdrop from "../../../common/components/loadingBackdrop";
import useRouterCreate from "../../../common/hooks/useRouterCreate";
import useRouterRemove from "../../../common/hooks/useRouterRemove";
import useSnackbar from "../../../common/hooks/useSnackbar";
import useFetchDocuments from "../../../firebase/hooks/useFetchDocuments";
import { FirestoreQuery, SchemaCollection } from "../../../firebase/types";
import { SchemaDocument } from "../../types";
import SchemaListItem from "./schemaListItem";

export interface SchemaListProps {
  authUser: AuthUser;
  query: FirestoreQuery;
}

export function SchemaList(props: SchemaListProps): JSX.Element {
  const { query, authUser } = props;

  const { loading, items, fetchMore } = useFetchDocuments({
    query,
    type: SchemaDocument,
    options: { limit: 10 },
  });

  const { showSnackbar } = useSnackbar();

  const collection = firebase.firestore().collection(SchemaCollection);
  const createSchema = useRouterCreate<SchemaDocument>({
    collection,
    setSnackbarState: showSnackbar,
    routerOptions: (_document, id) => ({
      url: "/schema/[schemaId]",
      as: `/schema/${id}`,
    }),
  });
  const { remove } = useRouterRemove({
    backOnSuccess: false,
    successMessage: "Schema removed",
    setSnackbarState: showSnackbar,
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
        <button onClick={fetchMore}>[ next ]</button>
      </List>
      <LoadingBackdrop isLoading={loading || createSchema.isLoading} />
    </>
  );
}
