import "firebase/firestore";

import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import List from "@material-ui/core/List";
import AddIcon from "@material-ui/icons/Add";
import firebase from "firebase/app";
import usePagination from "firestore-pagination-hook";
import { useRouter } from "next/router";
import compact from "lodash/compact";
import React, { useEffect, useMemo } from "react";

import Footer from "../../components/common/footer";
import Header from "../../components/common/header";
import LoadingBackdrop from "../../components/common/loadingBackdrop";
import SearchInput from "../../components/common/searchInput";
import withAuthUser from "../../components/pageWrappers/withAuthUser";
import withAuthUserInfo from "../../components/pageWrappers/withAuthUserInfo";
import ProjectListItem from "../../components/projects/projectListItem";
import { useAuthUserInfo } from "../../utils/auth/hooks";
import initFirebase from "../../utils/auth/initFirebase";
import { ProjectCollection } from "../../utils/firestore/types";
import { decodeProjectDocument } from "../../utils/projects/functions";

initFirebase();

function ProjectList(): JSX.Element {
  const { authUser } = useAuthUserInfo();
  const router = useRouter();

  useEffect(() => {
    if (!authUser) {
      router.push("/");
    }
  });

  const db = firebase.firestore();
  const collection = db.collection(ProjectCollection);

  const { loading, loadingMore, hasMore, items, loadMore } = usePagination(
    collection.orderBy("createdAt", "asc"),
    {
      limit: 10,
    },
  );

  const projects = useMemo(() => compact(items.map(decodeProjectDocument)), [
    items,
  ]);

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
            onClick={() => router.push("/project/create")}
          >
            New Project
          </Button>
        </>
      </Header>
      <Container>
        <List>
          {projects.map(pair => (
            <ProjectListItem key={pair.id} {...pair} />
          ))}
          {hasMore && !loadingMore && (
            <button onClick={loadMore}>[ more ]</button>
          )}
        </List>
      </Container>
      <LoadingBackdrop isLoading={loading} />
      <Footer />
    </>
  );
}

export default withAuthUser(withAuthUserInfo(ProjectList));
