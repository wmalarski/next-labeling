import "firebase/firestore";

import List from "@material-ui/core/List";
import React from "react";

import LoadingBackdrop from "../../components/common/loadingBackdrop";
import { AuthUser } from "../../utils/auth/user";
import { FirestoreQuery } from "../../utils/firestore/types";
import useFetchDocuments from "../../utils/firestore/useFetchDocuments";
import { ExternalDocument } from "../../utils/labeling/types/database";
import LabelingListItem from "./labelingListItem";

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

  return (
    <>
      <List>
        {items.map(pair => (
          <LabelingListItem key={pair.id} {...pair} />
        ))}
      </List>
      {hasMore && <button onClick={loadMore}>[ more ]</button>}
      <LoadingBackdrop isLoading={loading} />
    </>
  );
}
