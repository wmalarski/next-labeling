import List from "@material-ui/core/List";
import firebase from "firebase/app";
import "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { AuthUser } from "../../auth/user";
import LoadingBackdrop from "../../common/components/loadingBackdrop";
import ResultSnackbar from "../../common/components/resultSnackbar";
import useRouterRemove from "../../common/hooks/useRouterRemove";
import useFetchDocuments from "../../firestore/hooks/useFetchDocuments";
import {
  FirestoreQuery,
  LabelingCollection,
  ResultSnackbarState,
} from "../../firestore/types";
import { ExternalDocument } from "../types/database";
import LabelingListItem from "./labelingListItem";

type LabelingListState = {
  id: string;
  document: ExternalDocument;
}[];

export interface LabelingListProps {
  authUser: AuthUser;
  query: FirestoreQuery;
}

export default function LabelingList(props: LabelingListProps): JSX.Element {
  const { query } = props;

  const { loading, hasMore, items, loadMore } = useFetchDocuments({
    query,
    type: ExternalDocument,
    options: { limit: 10 },
  });

  const [visibleItems, setVisibleItems] = useState<LabelingListState>(items);

  useEffect(() => {
    setVisibleItems(items);
  }, [items]);

  const removeCallback = useCallback(
    (id, success) =>
      setVisibleItems(pairs => {
        if (!success) return pairs;
        return pairs.filter(pair => pair.id !== id);
      }),
    [],
  );

  const [snackbarState, setSnackbarState] = useState<ResultSnackbarState>({
    isOpen: false,
  });

  const collection = firebase.firestore().collection(LabelingCollection);
  const { remove, isLoading } = useRouterRemove({
    successMessage: "Labeling Removed",
    backOnSuccess: false,
    setSnackbarState,
    collection,
    removeCallback,
  });

  return (
    <>
      <List>
        {visibleItems.map(pair => (
          <LabelingListItem
            key={pair.id}
            {...pair}
            onRemoveClick={() => remove(pair.id)}
          />
        ))}
      </List>
      <LoadingBackdrop isLoading={loading || isLoading} />
      <ResultSnackbar state={snackbarState} setState={setSnackbarState} />
      {hasMore && <button onClick={loadMore}>[ more ]</button>}
    </>
  );
}
