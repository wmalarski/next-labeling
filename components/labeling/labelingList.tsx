import "firebase/firestore";

import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { useRouter } from "next/router";
import React from "react";

import LoadingBackdrop from "../../components/common/loadingBackdrop";
import { AuthUser } from "../../utils/auth/user";
import { FirestoreQuery } from "../../utils/firestore/types";
import useFetchDocuments from "../../utils/firestore/useFetchDocuments";
import { ExternalDocument } from "../../utils/labeling/types/database";

export interface LabelingListProps {
  authUser: AuthUser;
  query: FirestoreQuery;
}

export default function LabelingList(props: LabelingListProps): JSX.Element {
  const { query } = props;

  const router = useRouter();

  const { loading, loadingMore, hasMore, items, loadMore } = useFetchDocuments({
    query,
    type: ExternalDocument,
    options: { limit: 2 },
  });

  return (
    <>
      <List>
        {items.map(pair => {
          return (
            <ListItem key={pair.id}>
              {pair.document.name}
              <Button
                onClick={() =>
                  router.push("/labeling/[labelingId]", `/labeling/${pair.id}`)
                }
              >
                Edit
              </Button>
            </ListItem>
          );
        })}
      </List>
      {hasMore && !loadingMore && <button onClick={loadMore}>[ more ]</button>}
      <LoadingBackdrop isLoading={loading} />
    </>
  );
}
